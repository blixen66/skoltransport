import { useState, useCallback, useEffect } from 'react';
import { Address, OptimizationResult } from '../types';

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const API_KEY = 'AIzaSyA94zp7rvXJarol8tn4eMPSy7yFvHIXeLg';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      // Ta bort befintliga Google Maps scripts
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Skapa global callback funktion
      window.initGoogleMaps = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          setError(null);
        } else {
          setError('Google Maps API laddades inte korrekt');
        }
      };
      
      script.onerror = () => {
        setError('Kunde inte ladda Google Maps API');
        setIsLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const geocodeAddress = useCallback((address: string): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API inte laddad'));
        return;
      }

      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            reject(new Error(`Geocoding misslyckades: ${status}`));
          }
        });
      } catch (error) {
        reject(new Error(`Geocoding fel: ${error}`));
      }
    });
  }, []);

  const getDistanceMatrix = useCallback(async (coordinates: { lat: number; lng: number }[]): Promise<number[][]> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API inte laddad'));
        return;
      }

      try {
        const service = new window.google.maps.DistanceMatrixService();
        const origins = coordinates.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng));
        const destinations = [...origins];

        service.getDistanceMatrix({
          origins,
          destinations,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        }, (response: any, status: any) => {
          if (status === 'OK' && response && response.rows) {
            const matrix = response.rows.map((row: any) =>
              row.elements.map((element: any) => element.distance.value)
            );
            resolve(matrix);
          } else {
            reject(new Error(`Distance Matrix misslyckades: ${status}`));
          }
        });
      } catch (error) {
        reject(new Error(`Distance Matrix fel: ${error}`));
      }
    });
  }, []);

  const solveTSP = useCallback((distanceMatrix: number[][]): number[] => {
    const n = distanceMatrix.length;
    if (n <= 1) return [0];

    // Nearest Neighbor heuristik
    const visited = new Array(n).fill(false);
    const path = [0];
    visited[0] = true;

    for (let i = 1; i < n; i++) {
      let nearest = -1;
      let minDistance = Infinity;

      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const distance = distanceMatrix[path[path.length - 1]][j];
          if (distance < minDistance) {
            minDistance = distance;
            nearest = j;
          }
        }
      }

      if (nearest !== -1) {
        path.push(nearest);
        visited[nearest] = true;
      }
    }

    return path;
  }, []);

  const optimizeRoute = useCallback(async (addresses: string[]): Promise<OptimizationResult> => {
    if (addresses.length < 2) {
      return {
        addresses,
        isOptimized: false,
      };
    }

    setLoading(true);
    setError(null);

    try {
      // Geokoda alla adresser
      const coordinates = await Promise.all(
        addresses.map(address => geocodeAddress(address))
      );

      // Hämta avståndsmatris
      const distanceMatrix = await getDistanceMatrix(coordinates);

      // Lös TSP
      const optimalOrder = solveTSP(distanceMatrix);

      // Sortera adresser enligt optimal ordning
      const optimizedAddresses = optimalOrder.map(index => addresses[index]);

      // Beräkna totalt avstånd
      let totalDistance = 0;
      for (let i = 0; i < optimalOrder.length - 1; i++) {
        totalDistance += distanceMatrix[optimalOrder[i]][optimalOrder[i + 1]];
      }

      setLoading(false);

      return {
        addresses: optimizedAddresses,
        totalDistance,
        isOptimized: true,
      };
    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Okänt fel vid optimering';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [geocodeAddress, getDistanceMatrix, solveTSP]);

  const generateGoogleMapsUrl = useCallback((addresses: string[]): string => {
    if (addresses.length === 0) return '';
    
    const encodedAddresses = addresses.map(addr => encodeURIComponent(addr));
    return `https://www.google.com/maps/dir/${encodedAddresses.join('/')}`;
  }, []);

  return {
    isLoaded,
    loading,
    error,
    optimizeRoute,
    generateGoogleMapsUrl,
  };
};
