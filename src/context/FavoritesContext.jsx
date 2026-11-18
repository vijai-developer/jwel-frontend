import React, { createContext, useContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = 'sushma_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            const pid = item.productId || item.id;
            return {
              ...item,
              productId: pid,
              id: pid
            };
          });
        }
      } catch (e) {
        console.error('Error reading favorites from localStorage:', e);
      }
    }
    return [];
  });

  // Sync favorites state to localStorage on update
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Check if a product is in favorites
   */
  const isFavorite = (productId) => {
    if (!productId) return false;
    const targetId = String(productId);
    return favorites.some(item => String(item.productId || item.id) === targetId);
  };

  /**
   * Add a product to favorites (prevent duplicates)
   */
  const addToFavorites = (product) => {
    if (!product) return;
    const pid = String(product.productId || product.id);
    setFavorites(prev => {
      if (prev.some(item => String(item.productId || item.id) === pid)) {
        return prev;
      }
      const newFav = {
        productId: pid,
        id: pid,
        name: product.name,
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        image: product.image,
        hoverImage: product.hoverImage || product.gallery?.[1] || product.image,
        category: product.category,
        metalFinish: product.metalFinish,
        stones: product.stones,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        sku: product.sku
      };
      return [...prev, newFav];
    });
  };

  /**
   * Remove a product from favorites by ID
   */
  const removeFromFavorites = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setFavorites(prev => prev.filter(item => String(item.productId || item.id) !== targetId));
  };

  /**
   * Toggle a product in/out of favorites
   */
  const toggleFavorite = (product) => {
    if (!product) return;
    const pid = String(product.productId || product.id);
    if (isFavorite(pid)) {
      removeFromFavorites(pid);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoritesCount: favorites.length,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
