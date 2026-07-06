import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((p) => p._id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) return prev.filter((p) => p._id !== product._id);
      return [...prev, product];
    });
  };

  const isWishlisted = (productId) => wishlistItems.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
