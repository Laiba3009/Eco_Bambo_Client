// lib/cartTokenStorage.js
// Utility functions for managing cart token persistence

const CART_TOKEN_KEY = 'shopify_cart_token';
const CART_EXPIRES_KEY = 'cart_expires_at';
const LAST_SYNC_KEY = 'last_sync';
const DEFAULT_EXPIRY_DAYS = 30;

/**
 * Get cart token from localStorage
 * @returns {string|null} Cart token or null if not found
 */
export function getCartToken() {
  try {
    const token = localStorage.getItem(CART_TOKEN_KEY);
    if (!token) return null;
    
    // Check if token is expired
    if (isCartTokenExpired()) {
      console.log('[CartTokenStorage] Token expired, removing...');
      removeCartToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.warn('[CartTokenStorage] Failed to get cart token:', error);
    return null;
  }
}

/**
 * Save cart token to localStorage with expiration
 * @param {string} token - Cart token to save
 * @param {number} expiryDays - Days until expiration (default: 30)
 */
export function setCartToken(token, expiryDays = DEFAULT_EXPIRY_DAYS) {
  try {
    if (!token) {
      console.warn('[CartTokenStorage] Attempted to save empty token');
      return false;
    }

    localStorage.setItem(CART_TOKEN_KEY, token);
    
    // Set expiration date
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    localStorage.setItem(CART_EXPIRES_KEY, expiresAt.toISOString());
    
    // Update last sync time
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    
    console.log('[CartTokenStorage] Token saved successfully, expires:', expiresAt.toISOString());
    return true;
  } catch (error) {
    console.error('[CartTokenStorage] Failed to save cart token:', error);
    return false;
  }
}

/**
 * Remove cart token and related data from localStorage
 */
export function removeCartToken() {
  try {
    localStorage.removeItem(CART_TOKEN_KEY);
    localStorage.removeItem(CART_EXPIRES_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
    console.log('[CartTokenStorage] Token removed successfully');
    return true;
  } catch (error) {
    console.error('[CartTokenStorage] Failed to remove cart token:', error);
    return false;
  }
}

/**
 * Check if the current cart token is expired
 * @returns {boolean} True if expired or no expiration date found
 */
export function isCartTokenExpired() {
  try {
    const expiresAt = localStorage.getItem(CART_EXPIRES_KEY);
    if (!expiresAt) {
      console.log('[CartTokenStorage] No expiration date found');
      return true;
    }
    
    const isExpired = new Date() > new Date(expiresAt);
    if (isExpired) {
      console.log('[CartTokenStorage] Token expired at:', expiresAt);
    }
    
    return isExpired;
  } catch (error) {
    console.warn('[CartTokenStorage] Error checking token expiration:', error);
    return true; // Assume expired on error
  }
}

/**
 * Get the expiration date of the current cart token
 * @returns {Date|null} Expiration date or null if not found
 */
export function getCartTokenExpiration() {
  try {
    const expiresAt = localStorage.getItem(CART_EXPIRES_KEY);
    return expiresAt ? new Date(expiresAt) : null;
  } catch (error) {
    console.warn('[CartTokenStorage] Failed to get token expiration:', error);
    return null;
  }
}

/**
 * Get the last sync timestamp
 * @returns {Date|null} Last sync date or null if not found
 */
export function getLastSyncTime() {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? new Date(lastSync) : null;
  } catch (error) {
    console.warn('[CartTokenStorage] Failed to get last sync time:', error);
    return null;
  }
}

/**
 * Update the last sync timestamp to current time
 */
export function updateLastSyncTime() {
  try {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('[CartTokenStorage] Failed to update last sync time:', error);
    return false;
  }
}

/**
 * Check if cart data needs to be refreshed based on last sync time
 * @param {number} maxAgeMinutes - Maximum age in minutes before refresh needed
 * @returns {boolean} True if refresh is needed
 */
export function needsRefresh(maxAgeMinutes = 5) {
  try {
    const lastSync = getLastSyncTime();
    if (!lastSync) return true;
    
    const ageMinutes = (Date.now() - lastSync.getTime()) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  } catch (error) {
    console.warn('[CartTokenStorage] Error checking refresh need:', error);
    return true;
  }
}

/**
 * Validate cart token format (basic validation)
 * @param {string} token - Token to validate
 * @returns {boolean} True if token format appears valid
 */
export function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') return false;
  
  // Shopify cart IDs typically start with 'gid://shopify/Cart/'
  return token.startsWith('gid://shopify/Cart/') || token.length > 10;
}

/**
 * Get cart storage statistics for debugging
 * @returns {object} Storage statistics
 */
export function getStorageStats() {
  return {
    hasToken: !!getCartToken(),
    isExpired: isCartTokenExpired(),
    expiresAt: getCartTokenExpiration(),
    lastSync: getLastSyncTime(),
    needsRefresh: needsRefresh(),
    storageKeys: {
      token: CART_TOKEN_KEY,
      expires: CART_EXPIRES_KEY,
      lastSync: LAST_SYNC_KEY
    }
  };
}

/**
 * Clear all cart-related data from localStorage (for debugging/reset)
 */
export function clearAllCartData() {
  try {
    // Remove cart tokens
    removeCartToken();
    
    // Remove any legacy cart data
    localStorage.removeItem('cart'); // Old cart context data
    localStorage.removeItem('shopify_cart_cookie'); // Old cart client data
    
    console.log('[CartTokenStorage] All cart data cleared');
    return true;
  } catch (error) {
    console.error('[CartTokenStorage] Failed to clear cart data:', error);
    return false;
  }
}