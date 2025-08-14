import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishlist as getWishlistApi, addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi } from '../services/apiService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && token) {
        try {
          setLoading(true);
          const response = await getWishlistApi(token);
          if (response.data.success) {
            setWishlist(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist(null);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const response = await addToWishlistApi({ productId }, token);
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Failed to add to wishlist', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlistApi(productId, token);
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlist?.products?.some(p => p._id === productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
