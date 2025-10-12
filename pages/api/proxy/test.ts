import { NextApiRequest, NextApiResponse } from 'next';

// Simple test endpoint to verify proxy is working
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'Proxy test endpoint is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers['origin'],
      'referer': req.headers['referer']
    }
  });
}
