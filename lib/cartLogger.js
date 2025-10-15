// lib/cartLogger.js
// Comprehensive logging utility for cart operations

/**
 * Cart Logger - Centralized logging for cart operations
 * Provides structured logging with different levels and context
 */
class CartLogger {
  constructor() {
    this.logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    this.enableConsoleGroup = true;
    this.logHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Log levels: debug, info, warn, error
   */
  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Add log entry to history
   */
  addToHistory(level, component, message, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null
    };

    this.logHistory.unshift(entry);
    
    // Keep history size manageable
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Format log message with component and timestamp
   */
  formatMessage(component, message) {
    const timestamp = new Date().toLocaleTimeString();
    return `[${timestamp}] [${component}] ${message}`;
  }

  /**
   * Debug level logging
   */
  debug(component, message, data = null) {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage(component, message);
    this.addToHistory('debug', component, message, data);
    
    if (data) {
      console.log(`🔍 ${formattedMessage}`, data);
    } else {
      console.log(`🔍 ${formattedMessage}`);
    }
  }

  /**
   * Info level logging
   */
  info(component, message, data = null) {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage(component, message);
    this.addToHistory('info', component, message, data);
    
    if (data) {
      console.log(`ℹ️ ${formattedMessage}`, data);
    } else {
      console.log(`ℹ️ ${formattedMessage}`);
    }
  }

  /**
   * Warning level logging
   */
  warn(component, message, data = null) {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage(component, message);
    this.addToHistory('warn', component, message, data);
    
    if (data) {
      console.warn(`⚠️ ${formattedMessage}`, data);
    } else {
      console.warn(`⚠️ ${formattedMessage}`);
    }
  }

  /**
   * Error level logging
   */
  error(component, message, error = null, data = null) {
    const formattedMessage = this.formatMessage(component, message);
    
    // Always log errors regardless of log level
    this.addToHistory('error', component, message, { error: error?.message, stack: error?.stack, data });
    
    console.error(`❌ ${formattedMessage}`);
    
    if (error) {
      console.error('Error details:', error);
    }
    
    if (data) {
      console.error('Additional data:', data);
    }
  }

  /**
   * Start a grouped log section
   */
  group(component, title, data = null) {
    if (!this.enableConsoleGroup) return;
    
    const formattedTitle = this.formatMessage(component, title);
    console.group(`📦 ${formattedTitle}`);
    
    if (data) {
      console.log('Context:', data);
    }
  }

  /**
   * End a grouped log section
   */
  groupEnd() {
    if (!this.enableConsoleGroup) return;
    console.groupEnd();
  }

  /**
   * Log cart operation start
   */
  operationStart(component, operation, params = null) {
    this.group(component, `Starting ${operation}`, params);
    this.info(component, `Operation: ${operation} initiated`, params);
  }

  /**
   * Log cart operation success
   */
  operationSuccess(component, operation, result = null) {
    this.info(component, `Operation: ${operation} completed successfully`, result);
    this.groupEnd();
  }

  /**
   * Log cart operation failure
   */
  operationFailure(component, operation, error, params = null) {
    this.error(component, `Operation: ${operation} failed`, error, params);
    this.groupEnd();
  }

  /**
   * Log API call details
   */
  apiCall(component, method, url, params = null) {
    this.debug(component, `API Call: ${method} ${url}`, params);
  }

  /**
   * Log API response
   */
  apiResponse(component, method, url, response, duration = null) {
    const logData = {
      method,
      url,
      status: response?.status || 'unknown',
      duration: duration ? `${duration}ms` : null
    };
    
    if (response?.ok !== false) {
      this.debug(component, `API Response: ${method} ${url} succeeded`, logData);
    } else {
      this.warn(component, `API Response: ${method} ${url} failed`, logData);
    }
  }

  /**
   * Log cart state changes
   */
  stateChange(component, from, to, reason = null) {
    this.info(component, `State change: ${from} → ${to}`, { reason });
  }

  /**
   * Get recent log history
   */
  getHistory(count = 20) {
    return this.logHistory.slice(0, count);
  }

  /**
   * Get logs by component
   */
  getLogsByComponent(component, count = 20) {
    return this.logHistory
      .filter(entry => entry.component === component)
      .slice(0, count);
  }

  /**
   * Get error logs only
   */
  getErrorLogs(count = 10) {
    return this.logHistory
      .filter(entry => entry.level === 'error')
      .slice(0, count);
  }

  /**
   * Export logs for debugging
   */
  exportLogs() {
    const exportData = {
      timestamp: new Date().toISOString(),
      logLevel: this.logLevel,
      totalLogs: this.logHistory.length,
      logs: this.logHistory
    };
    
    console.log('📋 Cart Logs Export:', exportData);
    return exportData;
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
    this.info('CartLogger', 'Log history cleared');
  }

  /**
   * Performance timing utility
   */
  time(label) {
    console.time(`⏱️ [CartLogger] ${label}`);
  }

  timeEnd(label) {
    console.timeEnd(`⏱️ [CartLogger] ${label}`);
  }
}

// Export singleton instance
export const cartLogger = new CartLogger();
export default cartLogger;