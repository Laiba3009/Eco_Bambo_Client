// Cart add handler that uses Shopify's cart/add.js endpoint
// This adds items directly to the customer's cart (not headless)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Handle both JSON and form-encoded data
    let variantId, quantity = 1;
    
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      // Parse form data
      const params = new URLSearchParams(req.body);
      variantId = params.get('id') || params.get('items[][id]');
      quantity = parseInt(params.get('quantity') || params.get('items[][quantity]') || '1');
    } else {
      // Parse JSON data
      const body = req.body || {};
      variantId = body.variantId || body.id;
      quantity = body.quantity || 1;
    }
    
    if (!variantId) {
      return res.status(400).json({ ok: false, error: 'variantId/id required in request body' });
    }

    const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';
    
    console.log('[CART/ADD] Adding to Shopify cart:', {
      variantId,
      quantity,
      domain: SHOPIFY_DOMAIN
    });

    // Use Shopify's cart/add.js endpoint (not GraphQL)
    const cartUrl = `https://${SHOPIFY_DOMAIN}/cart/add.js`;
    
    const formData = new URLSearchParams();
    formData.append('id', String(variantId));
    formData.append('quantity', String(quantity));

    const response = await fetch(cartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Next.js-App/1.0',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    let cartData;

    try {
      cartData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[CART/ADD] Failed to parse Shopify response:', responseText);
      return res.status(500).json({ 
        ok: false, 
        error: 'Invalid response from Shopify',
        details: responseText
      });
    }

    if (!response.ok) {
      console.error('[CART/ADD] Shopify error:', {
        status: response.status,
        data: cartData
      });
      return res.status(response.status).json({
        ok: false,
        error: cartData.message || 'Failed to add item to cart',
        details: cartData
      });
    }

    console.log('[CART/ADD] Success:', cartData);

    // Return success response
    return res.status(200).json({
      ok: true,
      cart: cartData,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('[CART/ADD] Exception:', error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
