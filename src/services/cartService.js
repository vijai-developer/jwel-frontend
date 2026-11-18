import API from './api';

export const cartService = {
  // Fetch Cart Items
  getCart: async () => {
    try {
      const response = await API.get('/cart');
      return response.data;
    } catch (error) {
      const saved = localStorage.getItem('sushma_cart');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return [];
    }
  },

  // Add Item to Cart
  addToCart: async (product, quantity = 1, selectedSize = null) => {
    try {
      const response = await API.post('/cart/items', { productId: product.id, quantity, selectedSize });
      return response.data;
    } catch (error) {
      return { product, quantity, selectedSize };
    }
  },

  // Sync Cart to Server / LocalStorage
  syncCart: async (cartItems) => {
    try {
      await API.put('/cart', { items: cartItems });
    } catch (error) {
      localStorage.setItem('sushma_cart', JSON.stringify(cartItems));
    }
  },

  // Remove single item from server
  removeItem: async (productId) => {
    try {
      await API.delete(`/cart/items/${productId}`);
    } catch (error) {
      // ignore
    }
  },

  // Clear Cart from server
  clearCart: async () => {
    try {
      await API.delete('/cart');
    } catch (error) {
      // ignore
    }
  }
};

export default cartService;
