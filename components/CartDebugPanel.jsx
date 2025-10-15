// components/CartDebugPanel.jsx
// Debug panel for monitoring cart operations in development

import React, { useState, useEffect } from 'react';
import cartLogger from '../lib/cartLogger';
import { useCartPersistenceDebug } from '../hooks/useCartPersistence';
import cartManager from '../lib/cartManager';

const CartDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const debugInfo = useCartPersistenceDebug();

  // Refresh logs periodically
  useEffect(() => {
    const refreshLogs = () => {
      const recentLogs = cartLogger.getHistory(50);
      setLogs(recentLogs);
    };

    refreshLogs();

    if (autoRefresh) {
      const interval = setInterval(refreshLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleClearLogs = () => {
    cartLogger.clearHistory();
    setLogs([]);
  };

  const handleExportLogs = () => {
    const exportData = cartLogger.exportLogs();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'debug': return 'text-gray-600';
      default: return 'text-gray-800';
    }
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Cart Debug Panel"
        >
          🛒🔧
        </button>
      </div>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white shadow-xl overflow-hidden ml-auto">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">🛒 Cart Debug Panel</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Controls */}
              <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-2">
                <button
                  onClick={handleClearLogs}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Clear Logs
                </button>
                <button
                  onClick={handleExportLogs}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Export Logs
                </button>
                <button
                  onClick={debugInfo.logPersistenceData}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Log Debug Info
                </button>
                <button
                  onClick={debugInfo.testRestoration}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Test Restoration
                </button>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  Auto Refresh
                </label>
              </div>

              {/* Status Overview */}
              <div className="p-4 border-b bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Cart Status:</strong>
                    <div className={debugInfo.persistenceStatus?.hasToken ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.persistenceStatus?.hasToken ? '✅ Has Token' : '❌ No Token'}
                    </div>
                  </div>
                  <div>
                    <strong>Token Status:</strong>
                    <div className={debugInfo.persistenceStatus?.tokenExpired ? 'text-red-600' : 'text-green-600'}>
                      {debugInfo.persistenceStatus?.tokenExpired ? '⏰ Expired' : '✅ Valid'}
                    </div>
                  </div>
                  <div>
                    <strong>Cart Items:</strong>
                    <div className="text-blue-600">
                      {debugInfo.persistenceStatus?.cartSummary?.totalQuantity || 0} items
                    </div>
                  </div>
                  <div>
                    <strong>Total Logs:</strong>
                    <div className="text-purple-600">
                      {logs.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-auto p-4">
                <h3 className="font-semibold mb-2">Recent Logs:</h3>
                <div className="space-y-2 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic">No logs available</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="border-l-2 border-gray-300 pl-3 py-1">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getLogIcon(log.level)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                                {log.component}
                              </span>
                              <span className={`font-semibold ${getLogColor(log.level)}`}>
                                {log.level.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-gray-800 mb-1">
                              {log.message}
                            </div>
                            {log.data && (
                              <details className="text-gray-600">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                  Show Data
                                </summary>
                                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                  {JSON.stringify(log.data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDebugPanel;