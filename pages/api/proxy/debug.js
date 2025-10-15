// pages/api/proxy/debug.js
// Debug endpoint to test proxy functionality

export default async function handler(req, res) {
  const { method, query } = req;
  
  console.log('[Proxy Debug] Request:', { method, query, headers: req.headers });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';
    
    // Test Shopify cart.js endpoint
    const cartResponse = await fetch(`https://${SHOPIFY_DOMAIN}/cart.js`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Proxy-Debug/1.0'
      }
    });
    
    const cartData = await cartResponse.json().catch(() => null);
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      proxy: {
        status: 'working',
        method: method,
        query: query
      },
      shopify: {
        domain: SHOPIFY_DOMAIN,
        cartEndpoint: `https://${SHOPIFY_DOMAIN}/cart.js`,
        responseStatus: cartResponse.status,
        responseOk: cartResponse.ok,
        cartData: cartData
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL
      }
    };
    
    res.status(200).json(debugInfo);
    
  } catch (error) {
    console.error('[Proxy Debug] Error:', error);
    res.status(500).json({
      error: 'Debug failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}