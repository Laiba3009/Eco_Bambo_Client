import { useEffect } from 'react';

export default function Checkout() {
  useEffect(() => {
    // Redirect to Shopify's main cart page
    window.location.href = 'https://ecobambo.com/cart';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to checkout...</h1>
        <p className="text-gray-600">Please wait while we redirect you to Shopify's secure checkout.</p>
      </div>
    </div>
  );
} 