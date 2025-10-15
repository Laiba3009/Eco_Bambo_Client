// hooks/useCartPersistence.js
// React hook for cart persistence utilities and debugging

import { useState, useEffect } from 'react';
import cartPersistenceManager from '../lib/cartPersistence';
import { getStorageStats } from '../lib/cartTokenStorage';

/**
 * Hook for cart persistence utilities
 */
export function useCartPersistence() {
  const [persistenceStatus, setPersistenceStatus] = useState(null);
  const [storageStats, setStorageStats] = useState(null);

  // Get current persistence status
  const refreshStatus = () => {
    const status = cartPersistenceManager.getPersistenceStatus();
    const stats = getStorageStats();
    
    setPersistenceStatus(status);
    setStorageStats(stats);
  };

  useEffect(() => {
    refreshStatus();
    
    // Refresh status every 10 seconds
    const interval = setInterval(refreshStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual cart restoration
  const restoreCart = async () => {
    try {
      const result = await cartPersistenceManager.restoreCartFromSession();
      refreshStatus();
      return result;
    } catch (error) {
      console.error('Manual cart restoration failed:', error);
      return { restored: false, error: error.message };
    }
  };

  // Clear all persistence data
  const clearPersistence = () => {
    const result = cartPersistenceManager.clearPersistenceData();
    refreshStatus();
    return result;
  };

  // Force save cart state
  const saveCartState = () => {
    cartPersistenceManager.saveCartState();
    refreshStatus();
  };

  return {
    persistenceStatus,
    storageStats,
    refreshStatus,
    restoreCart,
    clearPersistence,
    saveCartState
  };
}

/**
 * Hook for cart persistence debugging (development only)
 */
export function useCartPersistenceDebug() {
  const persistence = useCartPersistence();
  
  // Debug utilities
  const debugInfo = {
    ...persistence,
    
    // Log all persistence data
    logPersistenceData: () => {
      console.group('🛒 Cart Persistence Debug');
      console.log('Persistence Status:', persistence.persistenceStatus);
      console.log('Storage Stats:', persistence.storageStats);
      console.log('Local Storage Keys:', Object.keys(localStorage).filter(key => 
        key.includes('cart') || key.includes('shopify')
      ));
      console.groupEnd();
    },
    
    // Test cart restoration
    testRestoration: async () => {
      console.log('🧪 Testing cart restoration...');
      const result = await persistence.restoreCart();
      console.log('Restoration result:', result);
      return result;
    },
    
    // Simulate cart token expiration
    simulateExpiration: () => {
      console.log('⏰ Simulating cart token expiration...');
      localStorage.setItem('cart_expires_at', new Date(Date.now() - 1000).toISOString());
      persistence.refreshStatus();
    }
  };

  return debugInfo;
}

export default useCartPersistence;