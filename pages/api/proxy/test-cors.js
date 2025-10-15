// pages/api/proxy/test-cors.js
// Test endpoint for CORS functionality

export default async function handler(req, res) {
  const { method } = req;
  
  console.log('[CORS Test] Request received:', { method, origin: req.headers.origin });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://eco-bambo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';
    
    // Test Shopify cart.js endpoint
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/cart.js`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Shopify-App-Proxy/1.0'
      }
    });
    
    const cartData = await response.json();
    
    res.status(200).json({
      success: true,
      message: 'CORS test successful',
      shopifyResponse: {
        status: response.status,
        ok: response.ok,
        cartItemCount: cartData?.item_count || 0
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[CORS Test] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}