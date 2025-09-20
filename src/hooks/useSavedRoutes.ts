import { useState, useCallback, useEffect } from 'react';
import { SavedRoute } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const useSavedRoutes = () => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWorkingAPIUrl = useCallback(async () => {
    const urls = [
      `${API_BASE_URL}/database.php`,
      'http://localhost:8080/database.php',
      '/database.php'
    ];
    
    for (const url of urls) {
      try {
        console.log('🧪 Testar URL:', url);
        const response = await fetch(`${url}?action=load`);
        if (response.ok) {
          console.log('✅ Fungerande URL hittad:', url);
          return url.replace('/database.php', '');
        }
      } catch (error) {
        console.log('❌ URL fungerar inte:', url, error);
      }
    }
    
    throw new Error('Ingen fungerande API-URL hittades');
  }, []);

  const loadSavedRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = await getWorkingAPIUrl();
      const response = await fetch(`${baseUrl}/database.php?action=load`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSavedRoutes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Okänt fel';
      setError(errorMessage);
      console.error('Fel vid laddning av rutter:', err);
    } finally {
      setLoading(false);
    }
  }, [getWorkingAPIUrl]);

  const saveRoute = useCallback(async (name: string, addresses: string[]) => {
    if (!name.trim()) {
      throw new Error('Ruttnamn krävs');
    }
    
    if (addresses.length === 0) {
      throw new Error('Minst en adress krävs');
    }

    try {
      const baseUrl = await getWorkingAPIUrl();
      const response = await fetch(`${baseUrl}/database.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save',
          name: name.trim(),
          addresses: addresses,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        await loadSavedRoutes(); // Ladda om listan
        return result;
      } else {
        throw new Error(result.message || 'Fel vid sparande av rutt');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Okänt fel';
      throw new Error(errorMessage);
    }
  }, [getWorkingAPIUrl, loadSavedRoutes]);

  const loadRoute = useCallback(async (routeId: number) => {
    try {
      const baseUrl = await getWorkingAPIUrl();
      const response = await fetch(`${baseUrl}/database.php?action=load_route&id=${routeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Okänt fel';
      throw new Error(errorMessage);
    }
  }, [getWorkingAPIUrl]);

  const deleteRoute = useCallback(async (routeId: number, routeName: string) => {
    if (!window.confirm(`Är du säker på att du vill ta bort rutten "${routeName}"?`)) {
      return false;
    }

    try {
      const baseUrl = await getWorkingAPIUrl();
      const response = await fetch(`${baseUrl}/database.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: routeId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        await loadSavedRoutes(); // Ladda om listan
        return true;
      } else {
        throw new Error(result.message || 'Fel vid borttagning av rutt');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Okänt fel';
      throw new Error(errorMessage);
    }
  }, [getWorkingAPIUrl, loadSavedRoutes]);

  // Ladda sparade rutter vid mount
  useEffect(() => {
    loadSavedRoutes();
  }, [loadSavedRoutes]);

  return {
    savedRoutes,
    loading,
    error,
    loadSavedRoutes,
    saveRoute,
    loadRoute,
    deleteRoute,
  };
};
