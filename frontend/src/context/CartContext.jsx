import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showToast('Please sign in to add items to your cart.', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((p) => p.productId === product._id);
      if (existing) {
        showToast(`Increased quantity of ${product.name} in cart!`, 'success');
        return prev.map((p) =>
          p.productId === product._id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      showToast(`Added ${product.name} to cart!`, 'success');
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (item) {
        showToast(`Removed ${item.name} from cart.`, 'info');
      }
      return prev.filter((i) => i.productId !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };


  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, updateQuantity, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

