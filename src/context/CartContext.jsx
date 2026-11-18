import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { MOCK_ORDERS } from '../data/mockOrders';
import productService from '../services/productService';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import confetti from 'canvas-confetti';

export const CartContext = createContext();
export const ShopContext = CartContext;

const CART_STORAGE_KEY = 'sushma_cart';

const VIEW_TO_PATH = {
  'home': '/',
  'catalog': '/catalog',
  'collections': '/catalog',
  'favorites': '/favorites',
  'product-detail': '/product-detail',
  'cart': '/cart',
  'checkout': '/checkout',
  'login': '/login',
  'account': '/account',
  'my-orders': '/my-orders',
  'tryon': '/tryon',
  'tracker': '/tracker',
  'admin-overview': '/admin/overview',
  'admin-products': '/admin/products',
  'admin-orders': '/admin/orders',
  'admin-customers': '/admin/customers'
};

const getPathForView = (view) => VIEW_TO_PATH[view] || '/';

const getViewForPath = (pathname) => {
  if (!pathname || pathname === '/') return 'home';
  if (pathname.startsWith('/catalog') || pathname.startsWith('/collections')) return 'catalog';
  if (pathname.startsWith('/favorites') || pathname.startsWith('/wishlist')) return 'favorites';
  if (pathname.startsWith('/product')) return 'product-detail';
  if (pathname.startsWith('/cart')) return 'cart';
  if (pathname.startsWith('/checkout')) return 'checkout';
  if (pathname.startsWith('/login')) return 'login';
  if (pathname.startsWith('/account') || pathname.startsWith('/my-orders')) return 'account';
  if (pathname.startsWith('/tryon') || pathname.startsWith('/virtual-mirror')) return 'tryon';
  if (pathname.startsWith('/tracker') || pathname.startsWith('/track') || pathname.startsWith('/orders')) return 'tracker';
  if (pathname === '/admin' || pathname.startsWith('/admin/overview')) return 'admin-overview';
  if (pathname.startsWith('/admin/products')) return 'admin-products';
  if (pathname.startsWith('/admin/orders')) return 'admin-orders';
  if (pathname.startsWith('/admin/customers')) return 'admin-customers';
  return 'home';
};

export const CURRENCY_CONFIG = {
  'INR': { symbol: '₹', rate: 1, label: 'INR (₹)' },
  'USD': { symbol: '$', rate: 0.012, label: 'USD ($)' },
  'AUD': { symbol: 'A$', rate: 0.018, label: 'AUD ($)' },
  'GBP': { symbol: '£', rate: 0.0095, label: 'GBP (£)' },
  'EUR': { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  'AED': { symbol: 'د.إ ', rate: 0.044, label: 'AED (د.إ)' },
  'CAD': { symbol: 'C$', rate: 0.016, label: 'CAD ($)' }
};

export const CartProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Currency Engine State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('sushma_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('sushma_currency', currency);
  }, [currency]);

  const formatPrice = useCallback((inrAmount) => {
    const num = Number(inrAmount) || 0;
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
    const converted = num * config.rate;
    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  // 1. Products State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // 2. Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sushma_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_ORDERS;
  });

  // 3. Cart State - with LocalStorage persistence & normalized structure
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize items to guarantee { productId, id, name, price, quantity, image }
          return parsed.map(item => {
            const pid = item.productId || item.id;
            return {
              ...item,
              productId: pid,
              id: pid,
              quantity: Math.max(1, Number(item.quantity) || 1),
              price: Number(item.price) || 0
            };
          });
        }
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
    return [];
  });

  // 4. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('sushma_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Navigation & View State (derived from current URL pathname)
  const currentView = useMemo(() => getViewForPath(location.pathname), [location.pathname]);

  const setCurrentView = useCallback((view) => {
    const targetPath = getPathForView(view);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [location.pathname, navigate]);

  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('sushma_category') || 'All Items';
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Overlays State (Should always start closed/null on page load)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [selectedProductForTryOn, setSelectedProductForTryOn] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Clean up any stale modal state from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('sushma_selected_product');
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sushma_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const prodData = await productService.getProducts();
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }
      } catch (e) {
        console.error('Error loading products:', e);
      }

      try {
        const orderData = await orderService.getOrders();
        if (orderData && orderData.length > 0) {
          setOrders(orderData);
        }
      } catch (e) {
        console.error('Error loading orders:', e);
      }

      try {
        const serverCart = await cartService.getCart();
        if (Array.isArray(serverCart) && serverCart.length > 0) {
          setCart(serverCart.map(item => ({
            ...item,
            productId: item.productId || item.id,
            id: item.productId || item.id,
            quantity: Math.max(1, Number(item.quantity) || 1),
            price: Number(item.price) || 0
          })));
        }
      } catch (e) {
        console.warn('Could not sync cart from server:', e);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('sushma_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Asynchronously synchronize with backend cart
    cartService.syncCart(cart);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sushma_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('sushma_category', selectedCategory);
    }
  }, [selectedCategory]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /**
   * Add to Cart
   * Prevents duplicates by incrementing quantity.
   * Ensures structure: { productId, id, name, price, quantity, image, ... }
   */
  const addToCart = (product, quantityToAdd = 1, selectedSize = null) => {
    if (!product) return;
    const pid = String(product.productId || product.id);
    const qty = Math.max(1, Number(quantityToAdd) || 1);

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => String(item.productId || item.id) === pid);

      if (existingIndex > -1) {
        // Product exists -> update quantity
        const updatedCart = [...prevCart];
        const newQty = updatedCart[existingIndex].quantity + qty;
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: newQty
        };
        return updatedCart;
      }

      // New product
      const newItem = {
        productId: pid,
        id: pid,
        name: product.name,
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        quantity: qty,
        image: product.image,
        metalFinish: product.metalFinish,
        category: product.category,
        sku: product.sku,
        selectedSize: selectedSize || product.selectedSize || product.sizesAvailable?.[0] || 'Standard'
      };

      return [...prevCart, newItem];
    });

    showToast(`Added "${product.name}" to bag.`);
  };

  /**
   * Increase quantity of product by 1
   */
  const increaseQuantity = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setCart(prevCart =>
      prevCart.map(item => {
        if (String(item.productId || item.id) === targetId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  /**
   * Decrease quantity of product by 1
   * If quantity becomes 0 or less -> removes item from cart
   */
  const decreaseQuantity = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setCart(prevCart =>
      prevCart.reduce((acc, item) => {
        if (String(item.productId || item.id) === targetId) {
          const nextQty = item.quantity - 1;
          if (nextQty > 0) {
            acc.push({ ...item, quantity: nextQty });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  /**
   * Remove product completely from cart
   */
  const removeFromCart = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setCart(prevCart => prevCart.filter(item => String(item.productId || item.id) !== targetId));
    showToast('Removed item from bag.');
  };

  /**
   * Generic quantity updater for direct input or buttons
   */
  const updateCartQuantity = (productId, newQty) => {
    if (!productId) return;
    const targetId = String(productId);
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(targetId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => {
        if (String(item.productId || item.id) === targetId) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    cartService.clearCart();
  };

  // Dynamic calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cart]);

  // Wishlist Handler
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Saved.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Favorites.');
        return [...prev, productId];
      }
    });
  };

  // Order Placement
  const placeOrder = (orderData) => {
    const newOrderId = `SJ-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items || cart,
      totalAmount: orderData.totalAmount || cartSubtotal,
      discountAmount: orderData.discountAmount || 0,
      finalAmount: orderData.finalAmount || cartSubtotal,
      paymentMethod: orderData.paymentMethod,
      paymentId: orderData.paymentId || `TXN_${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Processing',
      trackingNumber: `BD-${Math.floor(1000000 + Math.random() * 9000000)}-IN`,
      courier: 'BlueDart Express',
      timeline: [
        { status: 'Placed', time: 'Just now', done: true },
        { status: 'Quality Checked', time: 'In Progress', done: false },
        { status: 'Packed', time: 'Pending', done: false },
        { status: 'Dispatched', time: 'Pending', done: false },
        { status: 'Out for Delivery', time: 'Pending', done: false },
        { status: 'Delivered', time: 'Pending', done: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setSelectedOrderForInvoice(newOrder);
    showToast(`Order ${newOrderId} placed successfully!`);
    return newOrder;
  };

  // Admin Product Management
  const addProduct = async (productData) => {
    console.log('ADD PRODUCT CALLED:', productData);
    try {
      const newProduct = await productService.createProduct({
        ...productData,
        price: Number(productData.price),
        originalPrice: Number(
          productData.originalPrice || productData.price * 1.5
        ),
        stockQty: Number(productData.stockQty || 10),
        inStock: true,
        rating: 5.0,
        reviewsCount: 0,
        gallery: productData.image ? [productData.image] : []
      });

      setProducts(prev => [newProduct, ...prev]);

      showToast(`New piece "${newProduct.name}" added to inventory.`);
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Failed to add product.');
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    try {
      const currentProduct = products.find(p => p.id === productId);

      if (!currentProduct) {
        showToast('Product not found.');
        return;
      }

      const updatedProduct = await productService.updateProduct(productId, {
        ...currentProduct,
        ...updatedFields,
        price: Number(currentProduct.price),
        originalPrice: Number(currentProduct.originalPrice),
        stockQty: Number(
          updatedFields.stockQty ?? currentProduct.stockQty
        )
      });

      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? updatedProduct : p
        )
      );

      showToast('Product updated.');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product.');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);

      setProducts(prev =>
        prev.filter(p => p.id !== productId)
      );

      showToast('Product deleted from inventory.');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product.');
    }
  };


  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedTimeline = o.timeline.map(t => {
          if (t.status === newStatus) return { ...t, done: true, time: 'Just now' };
          return t;
        });
        return { ...o, status: newStatus, timeline: updatedTimeline };
      }
      return o;
    }));
    showToast(`Order ${orderId} updated to ${newStatus}.`);
  };

  const navigateToProductDetail = (product) => {
    setSelectedProductForDetail(null);
    const pid = product?.productId || product?.id;
    if (pid) {
      navigate(`/product/${pid}`);
    } else {
      navigate('/catalog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartContext.Provider value={{
      products,
      orders,
      cart,
      wishlist,
      currentView,
      setCurrentView,
      selectedCategory,
      setSelectedCategory,
      searchTerm,
      setSearchTerm,
      selectedProductForDetail,
      setSelectedProductForDetail,
      navigateToProductDetail,
      selectedProductForTryOn,
      setSelectedProductForTryOn,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      selectedOrderForInvoice,
      setSelectedOrderForInvoice,
      toast,
      showToast,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      placeOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      cartSubtotal,
      cartItemCount,
      currency,
      setCurrency,
      formatPrice,
      CURRENCY_CONFIG
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const ShopProvider = CartProvider;
export const useCart = () => useContext(CartContext);
export const useShop = useCart;

export default CartContext;
