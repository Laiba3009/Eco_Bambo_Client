// pages/api/proxy/cart.js
// Enhanced Shopify app proxy for cart operations with full session management

export default async function handler(req, res) {
  const { method, query } = req;
  const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';

  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('[Proxy] Cart operation:', { method, action: query.action, body: req.body });

  try {
    let shopifyUrl;
    let fetchOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Headless-Cart-Proxy/1.0',
      },
      credentials: 'include'
    };

    // Handle different cart operations
    switch (query.action) {
      case 'get':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart.js`;
        break;
        
      case 'add':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/add.js`;
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        
        // Convert JSON to form data for Shopify compatibility
        const formData = new URLSearchParams();
        if (req.body.id) formData.append('id', req.body.id);
        if (req.body.quantity) formData.append('quantity', req.body.quantity);
        if (req.body.properties) {
          Object.entries(req.body.properties).forEach(([key, value]) => {
            formData.append(`properties[${key}]`, value);
          });
        }
        fetchOptions.body = formData.toString();
        break;
        
      case 'update':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/update.js`;
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        
        // Handle cart updates
        const updateData = new URLSearchParams();
        if (req.body.updates) {
          Object.entries(req.body.updates).forEach(([key, value]) => {
            updateData.append(`updates[${key}]`, value);
          });
        }
        if (req.body.attributes) {
          Object.entries(req.body.attributes).forEach(([key, value]) => {
            updateData.append(`attributes[${key}]`, value);
          });
        }
        fetchOptions.body = updateData.toString();
        break;
        
      case 'change':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/change.js`;
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        
        const changeData = new URLSearchParams();
        if (req.body.id) changeData.append('id', req.body.id);
        if (req.body.quantity !== undefined) changeData.append('quantity', req.body.quantity);
        fetchOptions.body = changeData.toString();
        break;
        
      case 'clear':
        shopifyUrl = `https://${SHOPIFY_DOMAIN}/cart/clear.js`;
        fetchOptions.method = 'POST';
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action', validActions: ['get', 'add', 'update', 'change', 'clear'] });
    }

    console.log('[Proxy] Forwarding to Shopify:', { url: shopifyUrl, method: fetchOptions.method });

    // Forward request to Shopify
    const response = await fetch(shopifyUrl, fetchOptions);
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text, raw: true };
      }
    }

    console.log('[Proxy] Shopify response:', { 
      status: response.status, 
      ok: response.ok, 
      itemCount: data?.item_count,
      token: data?.token 
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Shopify request failed', 
        status: response.status,
        details: data 
      });
    }

    // Add proxy metadata
    const responseData = {
      ...data,
      _proxy: {
        timestamp: new Date().toISOString(),
        action: query.action,
        success: true
      }
    };

    res.status(200).json(responseData);
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message,
      action: query.action,
      _proxy: {
        timestamp: new Date().toISOString(),
        success: false
      }
    });
  }
}