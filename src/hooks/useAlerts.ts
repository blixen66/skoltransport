import { useState, useCallback } from 'react';
import { Alert, AlertType } from '../types';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback((message: string, type: AlertType) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    };

    setAlerts(prev => [...prev, newAlert]);

    // Ta bort automatiskt efter 5 sekunder
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    removeAlert,
    clearAllAlerts,
  };
};

