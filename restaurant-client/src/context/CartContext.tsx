import React, { createContext, useContext, useState } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, totalPrice, setTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export default CartContext;
