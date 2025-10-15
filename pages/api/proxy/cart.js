// pages/api/proxy/cart.js
// Shopify app proxy for cart operations

export default async function handler(req, res) {
  const { method, query } = req;
  const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';

  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let shopifyUrl;
    let fetchOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Handle different cart operations
    switch (query.action) {
      case 'get':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart.js`;
        break;
      case 'add':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/add.js`;
        fetchOptions.body = JSON.stringify(req.body);
        break;
      case 'update':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/update.js`;
        fetchOptions.body = JSON.stringify(req.body);
        break;
      case 'clear':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/clear.js`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Forward request to Shopify
    const response = await fetch(shopifyUrl, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Shopify request failed', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', message: error.message });
  }
}