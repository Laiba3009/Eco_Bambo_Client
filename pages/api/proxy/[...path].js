// pages/api/proxy/[...path].js
// Catch-all proxy route for Shopify App Proxy

export default async function handler(req, res) {
  const { method, query } = req;
  const path = query.path || [];
  
  console.log('[Proxy Catch-All] Request:', { method, path, query: Object.keys(query) });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route based on first path segment
  const action = path[0];
  
  try {
    switch (action) {
      case 'cart':
        // Handle cart operations
        const cartAction = path[1] || 'get';
        req.query = { ...req.query, action: cartAction };
        
        const cartHandler = await import('./cart.js');
        return cartHandler.default(req, res);
        
      case 'sync':
        // Handle synchronization
        return handleSync(req, res);
        
      case 'test':
        // Test endpoint
        return res.status(200).json({
          message: 'Proxy is working',
          path: path,
          method: method,
          timestamp: new Date().toISOString(),
          shop: query.shop
        });
        
      default:
        return res.status(404).json({
          error: 'Endpoint not found',
          path: path,
          availableEndpoints: ['cart', 'sync', 'test']
        });
    }
  } catch (error) {
    console.error('[Proxy Catch-All] Error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      path: path
    });
  }
}

async function handleSync(req, res) {
  const { method, body, query } = req;
  
  if (method === 'GET') {
    // Return sync status
    return res.status(200).json({
      status: 'ready',
      message: 'Cart sync service is available',
      endpoints: {
        cart: '/api/proxy/cart',
        sync: '/api/proxy/sync'
      }
    });
  }
  
  if (method === 'POST') {
    // Handle sync request
    console.log('[Proxy] Sync request:', body);
    
    return res.status(200).json({
      success: true,
      message: 'Sync completed',
      data: body
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}