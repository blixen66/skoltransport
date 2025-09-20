export interface Address {
  id: string;
  text: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Route {
  id: number;
  name: string;
  addresses: string[];
  created_at: string;
  updated_at: string;
}

export interface SavedRoute {
  id: number;
  name: string;
  addresses: string[];
  created_at: string;
  updated_at: string;
}

export interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
}

export interface OptimizationResult {
  addresses: string[];
  totalDistance?: number;
  totalDuration?: number;
  isOptimized: boolean;
}

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
  timestamp: number;
}

