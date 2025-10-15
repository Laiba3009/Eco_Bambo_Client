// pages/api/proxy/index.js
// Main Shopify App Proxy handler - this is what Shopify will call

import crypto from 'crypto';

const SHOPIFY_APP_SHARED_SECRET = process.env.SHOPIFY_APP_SHARED_SECRET;

export default async function handler(req, res) {
  const { method, query, body } = req;
  
  // Shopify app proxy authentication
  const shop = query.shop;
  const signature = query.signature;
  const timestamp = query.timestamp;
  
  console.log('[App Proxy] Request received:', { 
    method, 
    shop, 
    path: query.path,
    hasSignature: !!signature 
  });

  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', 'https://eco-bambo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verify Shopify signature for security
  if (signature && SHOPIFY_APP_SHARED_SECRET) {
    const isValid = verifyShopifySignature(query, SHOPIFY_APP_SHARED_SECRET);
    if (!isValid) {
      console.warn('[App Proxy] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  // Route to appropriate handler based on path
  const path = query.path || [];
  const action = Array.isArray(path) ? path[0] : path;

  try {
    switch (action) {
      case 'cart':
        // Forward to cart proxy
        return handleCartProxy(req, res);
        
      case 'sync':
        // Handle cart synchronization
        return handleCartSync(req, res);
        
      case 'health':
        // Health check endpoint
        return res.status(200).json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          shop: shop 
        });
        
      default:
        return res.status(404).json({ 
          error: 'Not found', 
          availableEndpoints: ['cart', 'sync', 'health'] 
        });
    }
  } catch (error) {
    console.error('[App Proxy] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}

// Handle cart operations
async function handleCartProxy(req, res) {
  const { query } = req;
  const cartAction = query.path?.[1] || 'get';
  
  // Import and use cart proxy handler
  const cartHandler = await import('./cart.js');
  
  // Modify query to include action
  req.query = { ...req.query, action: cartAction };
  
  return cartHandler.default(req, res);
}

// Handle cart synchronization
async function handleCartSync(req, res) {
  const { method, body } = req;
  
  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { headlessCartToken, shopifyCartToken } = body;
    
    console.log('[App Proxy] Cart sync requested:', {
      hasHeadlessToken: !!headlessCartToken,
      hasShopifyToken: !!shopifyCartToken
    });
    
    // Here you would implement cart merging logic
    // For now, return success
    res.status(200).json({
      success: true,
      message: 'Cart sync completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[App Proxy] Sync error:', error);
    res.status(500).json({ 
      error: 'Sync failed', 
      message: error.message 
    });
  }
}
// V
erify Shopify App Proxy signature
function verifyShopifySignature(query, secret) {
  try {
    const { signature, ...params } = query;
    
    // Sort parameters and create query string
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // Create HMAC
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(sortedParams);
    const calculatedSignature = hmac.digest('hex');
    
    return calculatedSignature === signature;
  } catch (error) {
    console.error('[App Proxy] Signature verification error:', error);
    return false;
  }
}