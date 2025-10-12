import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Shopify App Proxy handler with HMAC verification and cart session forwarding
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify HMAC signature for security (only in production)
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      const isValidRequest = verifyShopifyProxyRequest(req);
      if (!isValidRequest) {
        console.error('[PROXY] Invalid HMAC signature');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      console.log('[PROXY] Development mode - skipping HMAC verification');
    }

    const { path } = req.query;
    const pathArray = Array.isArray(path) ? path : [path];
    const targetPath = pathArray.join('/');

    console.log(`[PROXY] Handling request to: ${targetPath}`);

    // Handle different proxy routes
    switch (targetPath) {
      case 'cart/add':
        return await handleCartAdd(req, res);
      
      // TODO: Add more routes as needed
      // case 'cart/update':
      //   return await handleCartUpdate(req, res);
      // case 'cart/change':
      //   return await handleCartChange(req, res);
      // case 'pages/contact':
      //   return await handleContactForm(req, res);
      
      default:
        console.log(`[PROXY] Unhandled route: ${targetPath}`);
        return res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('[PROXY] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Verify Shopify App Proxy HMAC signature
function verifyShopifyProxyRequest(req: NextApiRequest): boolean {
  const sharedSecret = process.env.SHOPIFY_APP_SHARED_SECRET;
  
  if (!sharedSecret) {
    console.error('[PROXY] SHOPIFY_APP_SHARED_SECRET not configured');
    return false;
  }

  // Get the signature from query parameters
  const signature = req.query.signature as string;
  if (!signature) {
    console.error('[PROXY] No signature found in request');
    return false;
  }

  // Remove signature from query params for verification
  const { signature: _, ...queryParams } = req.query;
  
  // Create query string for verification (sorted keys)
  const sortedParams = Object.keys(queryParams)
    .sort()
    .map(key => `${key}=${queryParams[key]}`)
    .join('&');

  // Create HMAC
  const hmac = crypto
    .createHmac('sha256', sharedSecret)
    .update(sortedParams)
    .digest('hex');

  // Compare signatures
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(hmac, 'hex')
  );

  if (!isValid) {
    console.error('[PROXY] HMAC verification failed', {
      expected: hmac,
      received: signature,
      params: sortedParams
    });
  }

  return isValid;
}

// Handle cart/add requests - proxy to Shopify's cart/add.js endpoint
async function handleCartAdd(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';
    const shopifyCartUrl = `https://${shopifyDomain}/cart/add.js`;

    console.log('[PROXY] Forwarding cart/add request to Shopify:', shopifyCartUrl);

    // Forward the request to Shopify's cart/add.js endpoint
    const shopifyResponse = await fetch(shopifyCartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Shopify-App-Proxy/1.0',
        // Forward important headers from the original request
        'X-Forwarded-For': req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
        'X-Real-IP': req.headers['x-real-ip'] as string || req.socket.remoteAddress || '',
      },
      body: new URLSearchParams(req.body).toString(),
    });

    const responseText = await shopifyResponse.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[PROXY] Failed to parse Shopify response:', responseText);
      return res.status(500).json({ error: 'Invalid response from Shopify' });
    }

    // Forward Shopify's response status and data
    res.status(shopifyResponse.status).json(responseData);

    console.log('[PROXY] Cart add response:', {
      status: shopifyResponse.status,
      success: shopifyResponse.ok,
      data: responseData
    });

  } catch (error) {
    console.error('[PROXY] Cart add error:', error);
    return res.status(500).json({ 
      error: 'Failed to add item to cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// TODO: Implement additional proxy handlers as needed
// 
// async function handleCartUpdate(req: NextApiRequest, res: NextApiResponse) {
//   // Handle cart update requests
//   // Proxy to Shopify's cart/update.js endpoint
// }
//
// async function handleCartChange(req: NextApiRequest, res: NextApiResponse) {
//   // Handle cart change requests  
//   // Proxy to Shopify's cart/change.js endpoint
// }
//
// async function handleContactForm(req: NextApiRequest, res: NextApiResponse) {
//   // Handle contact form submissions
//   // Process form data and send emails
// }

// Helper function to get client IP address
function getClientIP(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  );
}
