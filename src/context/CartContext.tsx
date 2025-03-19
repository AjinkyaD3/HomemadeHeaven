import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variation?: ProductVariation, customizations?: CartItem['customizations']) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string, variationId?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product, 
    quantity: number, 
    variation?: ProductVariation,
    customizations?: CartItem['customizations']
  ) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && 
        JSON.stringify(item.variation?.id) === JSON.stringify(variation?.id) &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item if product doesn't exist
        return [...prevCart, { product, quantity, variation, customizations }];
      }
    });
  };

  const removeFromCart = (productId: string, variationId?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.product.id === productId && 
        (variationId ? item.variation?.id === variationId : true))
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variationId?: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        (item.product.id === productId && 
         (variationId ? item.variation?.id === variationId : true)) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId: string, variationId?: string) => {
    return cart.some(item => 
      item.product.id === productId && 
      (variationId ? item.variation?.id === variationId : true)
    );
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cart.reduce(
    (total, item) => {
      const price = item.variation?.price ?? item.product.price;
      return total + price * item.quantity;
    }, 
    0
  );

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};