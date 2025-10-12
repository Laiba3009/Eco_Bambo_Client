import { NextApiRequest, NextApiResponse } from 'next';

// Debug endpoint to test Shopify App Proxy configuration
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = [
    'https://eco-bambo.vercel.app',
    'https://ecobambo.com',
    'http://localhost:3000'
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://eco-bambo.vercel.app';
  
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'Shopify App Proxy Debug Endpoint',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    method: req.method,
    origin: origin,
    corsOrigin: corsOrigin,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip']
    },
    sharedSecretConfigured: !!process.env.SHOPIFY_APP_SHARED_SECRET,
    shopifyDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  });
}
