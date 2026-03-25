import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  getQty: (productId: string) => number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('blinkit_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalSavings = items.reduce((s, i) => s + Math.max(0, (i.mrp - i.price)) * i.qty, 0);

  function addItem(product: any) {
    setItems(prev => {
      const existing = prev.find(i => i.productId === (product._id || product.productId));
      if (existing) {
        return prev.map(i => i.productId === (product._id || product.productId) ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        productId: product._id || product.productId,
        name: product.title || product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit || '',
        image: product.images?.[0]?.url || product.image || '',
        qty: 1
      }];
    });
  }

  function removeItem(productId: string) {
    setItems(prev => {
      const item = prev.find(i => i.productId === productId);
      if (item && item.qty > 1) {
        return prev.map(i => i.productId === productId ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter(i => i.productId !== productId);
    });
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.productId !== productId));
    } else {
      setItems(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i));
    }
  }

  function clearCart() {
    setItems([]);
  }

  const getQty = useCallback((productId: string) => {
    return items.find(i => i.productId === productId)?.qty || 0;
  }, [items]);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, totalSavings, addItem, removeItem, updateQty, clearCart, getQty, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
