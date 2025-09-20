import { useState, useCallback } from 'react';
import { Address } from '../types';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);

  const addAddress = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const newAddress: Address = {
      id: Date.now().toString(),
      text: text.trim(),
    };
    
    setAddresses(prev => [...prev, newAddress]);
    setIsOptimized(false);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    setIsOptimized(false);
  }, []);

  const clearAllAddresses = useCallback(() => {
    setAddresses([]);
    setIsOptimized(false);
  }, []);

  const moveAddress = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setAddresses(prev => {
      const newAddresses = [...prev];
      const [movedAddress] = newAddresses.splice(fromIndex, 1);
      newAddresses.splice(toIndex, 0, movedAddress);
      return newAddresses;
    });
    
    setIsOptimized(false);
  }, []);

  const setOptimizedAddresses = useCallback((optimizedAddresses: string[]) => {
    setAddresses(prev => {
      const newAddresses = optimizedAddresses.map((text, index) => ({
        id: prev[index]?.id || Date.now().toString() + index,
        text,
        coordinates: prev[index]?.coordinates,
      }));
      return newAddresses;
    });
    setIsOptimized(true);
  }, []);

  const loadAddresses = useCallback((addressTexts: string[]) => {
    const newAddresses = addressTexts.map((text, index) => ({
      id: Date.now().toString() + index,
      text,
    }));
    setAddresses(newAddresses);
    setIsOptimized(false);
  }, []);

  return {
    addresses,
    isOptimized,
    addAddress,
    removeAddress,
    clearAllAddresses,
    moveAddress,
    setOptimizedAddresses,
    loadAddresses,
  };
};

