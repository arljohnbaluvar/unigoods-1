import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  seller?: {
    id: string;
    name: string;
    university: string;
    rating: number;
  };
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  saveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;
  removeSavedItem: (itemId: string) => void;
}

const CART_STORAGE_KEY = 'unigoods_cart';
const SAVED_ITEMS_STORAGE_KEY = 'unigoods_saved_items';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart items from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Initialize saved items from localStorage
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error loading saved items from localStorage:', error);
      return [];
    }
  });

  // Update localStorage whenever cart items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Update localStorage whenever saved items change
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (error) {
      console.error('Error saving saved items to localStorage:', error);
    }
  }, [savedItems]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return currentItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      // Add new item if it doesn't exist
      return [...currentItems, newItem];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const saveForLater = useCallback((itemId: string) => {
    setItems((currentItems) => {
      const itemToSave = currentItems.find((item) => item.id === itemId);
      if (!itemToSave) return currentItems;

      setSavedItems((current) => [...current, { ...itemToSave, quantity: 1 }]);
      return currentItems.filter((item) => item.id !== itemId);
    });
  }, []);

  const moveToCart = useCallback((itemId: string) => {
    setSavedItems((currentItems) => {
      const itemToMove = currentItems.find((item) => item.id === itemId);
      if (!itemToMove) return currentItems;

      addItem({ ...itemToMove, quantity: 1 });
      return currentItems.filter((item) => item.id !== itemId);
    });
  }, [addItem]);

  const removeSavedItem = useCallback((itemId: string) => {
    setSavedItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  }, []);

  const value = {
    items,
    savedItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal,
    saveForLater,
    moveToCart,
    removeSavedItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 