// lib/cartClient.js
const CART_LOCAL_KEY = "shopify_cart_id";

export function getSavedCartId() {
  try { return localStorage.getItem(CART_LOCAL_KEY); } catch (e) { return null; }
}
export function saveCartId(id) {
  try { if (!id) return; localStorage.setItem(CART_LOCAL_KEY, id); } catch (e) {}
}
export function removeSavedCartId() {
  try { localStorage.removeItem(CART_LOCAL_KEY); } catch (e) {}
}

/**
 * addToCartApi - add a variant to cart. If saved cartId is invalid, automatically
 * retries once after clearing saved cart id.
 * @param {string} variantId - numeric id OR full gid
 * @param {number} quantity
 */
export async function addToCartApi(variantId, quantity = 1) {
  // inner helper that calls API with optional cartId
  async function callWithCartId(cartIdToUse) {
    const body = { variantId, quantity };
    if (cartIdToUse) body.cartId = cartIdToUse;

    const r = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text().catch(() => null);
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) {
      throw new Error(`Invalid JSON from server: ${text}`);
    }

    if (!r.ok || data?.ok === false) {
      const serverErr = data?.error || `Request failed: ${r.status}`;
      return { success: false, error: serverErr, raw: data };
    }

    if (!data?.cart) {
      return { success: false, error: "No cart returned from server", raw: data };
    }

    return { success: true, cart: data.cart, replacedCart: !!data.replacedCart, raw: data };
  }

  // 1) try using saved cart id (if any)
  const saved = getSavedCartId();
  if (saved) {
    const first = await callWithCartId(saved);
    if (first.success) {
      // persisted cart ok
      saveCartId(first.cart.id);
      return first.cart;
    }

    // If failure and server indicates cart missing, clear and retry once
    try {
      const errVal = first.error;
      const errStr = typeof errVal === "string" ? errVal.toLowerCase() : JSON.stringify(errVal).toLowerCase();
      const indicatesMissing = errStr.includes("does not exist") || errStr.includes("cartid") || errStr.includes("cart id") || (first.raw && JSON.stringify(first.raw).toLowerCase().includes("cartid"));

      if (indicatesMissing || first.raw?.replacedCart) {
        // clear saved id and retry
        removeSavedCartId();
        const second = await callWithCartId(null);
        if (second.success) {
          saveCartId(second.cart.id);
          return second.cart;
        }
        // else fall through to throw
        const serverErr = second.error || JSON.stringify(second.raw);
        throw new Error(typeof serverErr === "object" ? JSON.stringify(serverErr) : serverErr);
      }

      // Other kind of error (not cart missing) -> throw meaningful message
      throw new Error(typeof errVal === "object" ? JSON.stringify(errVal) : errVal);
    } catch (retryErr) {
      throw retryErr;
    }
  } else {
    // No saved cart -> simple create flow
    const resp = await callWithCartId(null);
    if (!resp.success) {
      const serverErr = resp.error || JSON.stringify(resp.raw);
      throw new Error(typeof serverErr === "object" ? JSON.stringify(serverErr) : serverErr);
    }
    saveCartId(resp.cart.id);
    return resp.cart;
  }
}
