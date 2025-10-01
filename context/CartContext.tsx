import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartItem = {
  product: any;
  variantId: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any, variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Save in localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, variantId: string, quantity: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.variantId === variantId);
      if (existing) {
        return prevCart.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, variantId, quantity }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
