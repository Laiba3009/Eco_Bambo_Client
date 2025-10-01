// pages/api/cart/add.js
// Resilient API: if cartLinesAdd fails because the cart doesn't exist,
// fall back to creating a new cart with the requested line.

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
  
    try {
      const { variantId, quantity = 1, cartId } = req.body || {};
      if (!variantId) return res.status(400).json({ ok: false, error: "variantId required in request body" });
  
      const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
      if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
        console.error("[/api/cart/add] Missing env vars", { SHOPIFY_DOMAIN, hasToken: !!STOREFRONT_TOKEN });
        return res.status(500).json({ ok: false, error: "Shopify env variables not configured on server" });
      }
  
      const variantGid = variantId.startsWith("gid://") ? variantId : `gid://shopify/ProductVariant/${variantId}`;
      const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
  
      async function callShopify(query, variables = {}) {
        const r = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query, variables }),
        });
  
        const text = await r.text().catch(() => null);
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (parseErr) {
          console.error("[/api/cart/add] Failed to parse Shopify response", parseErr, { status: r.status, text });
          throw new Error(`Shopify returned non-JSON response (status ${r.status}).`);
        }
  
        if (!r.ok) {
          console.error("[/api/cart/add] Shopify HTTP error", { status: r.status, json });
          const message = json?.errors ? JSON.stringify(json.errors) : `Shopify HTTP ${r.status}`;
          throw new Error(message);
        }
  
        if (json.errors) {
          console.error("[/api/cart/add] Shopify GraphQL errors", json.errors);
          throw new Error(JSON.stringify(json.errors));
        }
  
        return json.data;
      }
  
      const CART_CREATE = `
        mutation cartCreate($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart { id checkoutUrl lines(first: 100) { edges { node { id quantity merchandise { ... on ProductVariant { id } } } } } }
            userErrors { field message }
          }
        }
      `;
  
      const CART_LINES_ADD = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart { id checkoutUrl lines(first: 100) { edges { node { id quantity merchandise { ... on ProductVariant { id } } } } } }
            userErrors { field message }
          }
        }
      `;
  
      // Helper: create new cart
      async function createCart(lines) {
        const data = await callShopify(CART_CREATE, { lines });
        const payload = data.cartCreate;
        if (payload.userErrors && payload.userErrors.length) {
          console.error("[/api/cart/add] cartCreate userErrors", payload.userErrors);
          return { ok: false, error: payload.userErrors };
        }
        return { ok: true, cart: payload.cart };
      }
  
      // Helper: add lines to existing cart
      async function addLines(cartIdToUse, lines) {
        const data = await callShopify(CART_LINES_ADD, { cartId: cartIdToUse, lines });
        const payload = data.cartLinesAdd;
        if (payload.userErrors && payload.userErrors.length) {
          return { ok: false, userErrors: payload.userErrors };
        }
        return { ok: true, cart: payload.cart };
      }
  
      const lines = [{ quantity: Number(quantity), merchandiseId: variantGid }];
  
      // If no cartId -> create
      if (!cartId) {
        const result = await createCart(lines);
        if (!result.ok) return res.status(400).json({ ok: false, error: result.error });
        return res.status(200).json({ ok: true, cart: result.cart });
      }
  
      // Try to add to existing cart
      try {
        const addResult = await addLines(cartId, lines);
        if (addResult.ok) return res.status(200).json({ ok: true, cart: addResult.cart });
  
        // If addResult failed, inspect userErrors for 'cart does not exist' or related cartId errors
        const userErrors = addResult.userErrors || [];
        const joined = JSON.stringify(userErrors).toLowerCase();
  
        const cartNotExist = joined.includes("does not exist") || joined.includes("cartid") || joined.includes("cart id");
        if (cartNotExist) {
          console.warn("[/api/cart/add] Existing cartId not found or invalid, creating a new cart. userErrors:", userErrors);
          // create a new cart instead (fall back)
          const newCartResult = await createCart(lines);
          if (!newCartResult.ok) return res.status(400).json({ ok: false, error: newCartResult.error });
          // Return a special flag to tell client it should replace stored cart id
          return res.status(200).json({ ok: true, cart: newCartResult.cart, replacedCart: true });
        }
  
        // Other userErrors -> return them
        console.error("[/api/cart/add] cartLinesAdd userErrors (not cart-missing):", userErrors);
        return res.status(400).json({ ok: false, error: userErrors });
      } catch (addErr) {
        // any unexpected exception while adding -> fallback: create a new cart
        console.error("[/api/cart/add] Exception during cartLinesAdd, will try createFallback:", addErr);
        try {
          const fallback = await createCart(lines);
          if (!fallback.ok) return res.status(500).json({ ok: false, error: fallback.error });
          return res.status(200).json({ ok: true, cart: fallback.cart, replacedCart: true });
        } catch (fallbackErr) {
          console.error("[/api/cart/add] Fallback create also failed:", fallbackErr);
          return res.status(500).json({ ok: false, error: fallbackErr.message || String(fallbackErr) });
        }
      }
    } catch (err) {
      console.error("[/api/cart/add] Exception:", err);
      const message = err?.message || String(err);
      return res.status(500).json({ ok: false, error: message });
    }
  }
  