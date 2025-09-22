import { useCart } from "@/context/CartContext";

const CheckoutButton = () => {
  const { cart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Build cart URL
    const cartString = cart
      .map((item) => `${item.variantId}:${item.quantity}`)
      .join(",");

    const checkoutUrl = `https://ecobambo.com/cart/${cartString}`;
    window.location.href = checkoutUrl;
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
