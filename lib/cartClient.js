// lib/cartClient.js
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecobambo.com";
const CART_LOCAL_KEY = "shopify_cart_cookie";

export function getSavedCartId() {
  try { return localStorage.getItem(CART_LOCAL_KEY); } catch { return null; }
}

export function saveCartId(id) {
  try { if (id) localStorage.setItem(CART_LOCAL_KEY, id); } catch {}
}

export function removeSavedCartId() {
  try { localStorage.removeItem(CART_LOCAL_KEY); } catch {}
}

export async function ensureCart() {
  const saved = getSavedCartId();
  if (saved) return saved;

  // Try to get existing Shopify cart
  const r = await fetch(`https://${SHOPIFY_DOMAIN}/cart.js`, { credentials: "include" });
  const cart = await r.json().catch(() => null);
  if (cart && cart.token) {
    saveCartId(cart.token);
    return cart.token;
  }

  // Otherwise create an empty cart
  const createResp = await fetch(`https://${SHOPIFY_DOMAIN}/cart/create.js`, {
    method: "POST",
    credentials: "include",
  });
  const newCart = await createResp.json().catch(() => null);
  if (newCart && newCart.token) {
    saveCartId(newCart.token);
    return newCart.token;
  }

  throw new Error("Failed to ensure Shopify cart");
}

export async function addToCartApi(variantId, quantity = 1) {
  const cartId = await ensureCart();

  const formData = new URLSearchParams();
  formData.append("id", String(variantId));
  formData.append("quantity", String(quantity));

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/cart/add.js`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new Error("Failed to add item to Shopify cart");
  }

  return data;
}
