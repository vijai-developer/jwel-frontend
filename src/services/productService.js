import API from './api';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export const productService = {
  // Fetch All Products
  getProducts: async () => {
    try {
      const response = await API.get('/products');
      return response.data;
    } catch (error) {
      // Fallback to local storage or initial data
      const saved = localStorage.getItem('sushma_products');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return INITIAL_PRODUCTS;
    }
  },

  // Fetch Single Product by ID
  getProductById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const products = await productService.getProducts();
      return products.find(p => p.id === id) || null;
    }
  },

  // Add Product
  createProduct: async (productData) => {
    console.log('CREATE PRODUCT API CALLED:', productData);
    try {
      const response = await API.post('/products', productData);
      return response.data;
    } catch (error) {
      // Return structured item for local state fallback
      const newId = `sj-${Date.now().toString().slice(-4)}`;
      return {
        id: newId,
        sku: productData.sku || `SJ-NEW-${Math.floor(100 + Math.random() * 900)}`,
        rating: 5.0,
        reviewsCount: 1,
        inStock: true,
        gallery: [productData.image],
        ...productData,
        price: Number(productData.price),
        originalPrice: Number(productData.originalPrice || productData.price * 1.5),
        stockQty: Number(productData.stockQty || 10)
      };
    }
  },

  // Update Product
  updateProduct: async (id, updatedFields) => {
    try {
      const response = await API.put(`/products/${id}`, updatedFields);
      return response.data;
    } catch (error) {
      return { id, ...updatedFields };
    }
  },

  // Delete Product
  deleteProduct: async (id) => {
    try {
      await API.delete(`/products/${id}`);
      return { success: true, id };
    } catch (error) {
      return { success: true, id };
    }
  },

  // Get Low Stock Products Alert
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await API.get(`/products/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      const products = await productService.getProducts();
      return products.filter(p => (p.stockQty !== undefined ? p.stockQty : 10) <= threshold);
    }
  }
};

export default productService;
