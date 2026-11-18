import API from './api';
import { MOCK_ORDERS } from '../data/mockOrders';

export const orderService = {
  // Get All Orders
  getAllOrders: async () => {
    return orderService.getOrders();
  },

  // Get All Orders Base
  getOrders: async () => {
    try {
      const response = await API.get('/orders');
      return response.data;
    } catch (error) {
      const saved = localStorage.getItem('sushma_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return MOCK_ORDERS;
    }
  },

  // Get Authenticated Customer Orders (Resilient Multi-Source Reconciliation)
  getMyOrders: async () => {
    let apiOrders = [];
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      savedUser = {};
    }
    const userEmail = (savedUser?.email || '').trim().toLowerCase();

    try {
      const response = await API.get('/orders/my-orders');
      if (Array.isArray(response.data)) {
        apiOrders = response.data;
      }
    } catch (error) {
      console.warn('API /orders/my-orders failed, will reconcile with store orders:', error);
    }

    try {
      // Reconcile with all store orders matching user's email if my-orders missed any
      const allOrders = await orderService.getOrders();
      const matchingAllOrders = (allOrders || []).filter(o => {
        if (!userEmail) return false;
        const cEmail = (o.customer?.email || o.customerEmail || '').trim().toLowerCase();
        return cEmail === userEmail;
      });

      // Also reconcile with session cache
      let cachedVaultOrders = [];
      try {
        if (userEmail) {
          cachedVaultOrders = JSON.parse(localStorage.getItem(`sushma_vault_orders_${userEmail}`) || '[]');
        }
      } catch (e) {
        cachedVaultOrders = [];
      }

      // Merge and deduplicate by ID and orderCode
      const combined = [...apiOrders, ...matchingAllOrders, ...cachedVaultOrders];
      const seen = new Set();
      const merged = [];

      for (const o of combined) {
        if (!o) continue;
        const key = (o.orderCode || o.id || '').toString();
        if (key && !seen.has(key)) {
          seen.add(key);
          merged.push(o);
        }
      }

      if (merged.length > 0) {
        return merged;
      }
    } catch (err) {
      console.error('Error in order reconciliation:', err);
    }

    return apiOrders;
  },

  // Get Order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const orders = await orderService.getOrders();
      return orders.find(o => o.id === orderId || o.trackingNumber === orderId) || null;
    }
  },

  // Place Order
  createOrder: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return response.data;
    } catch (error) {
      const newOrderId = `SJ-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        id: newOrderId,
        date: new Date().toISOString(),
        customer: orderData.customer,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        discountAmount: orderData.discountAmount,
        finalAmount: orderData.finalAmount,
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
    }
  },

  // Update Order Status
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      return { orderId, newStatus };
    }
  },

  // Get Unique Customers List
  getCustomers: async () => {
    try {
      const response = await API.get('/customers');
      return response.data;
    } catch (error) {
      const orders = await orderService.getOrders();
      const customerMap = new Map();
      
      orders.forEach(order => {
        if (order.customer && order.customer.email) {
          const email = order.customer.email;
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              ...order.customer,
              totalOrders: 1,
              totalSpent: order.finalAmount || order.totalAmount || 0,
              lastOrderDate: order.date || new Date().toISOString()
            });
          } else {
            const existing = customerMap.get(email);
            existing.totalOrders += 1;
            existing.totalSpent += (order.finalAmount || order.totalAmount || 0);
          }
        }
      });
      
      return Array.from(customerMap.values());
    }
  },

  // Get Aggregated Dashboard Metrics
  getDashboardStats: async () => {
    try {
      const response = await API.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      const orders = await orderService.getOrders();
      const totalSales = orders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);
      const customers = await orderService.getCustomers();
      
      return {
        totalSales,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        avgOrderValue: orders.length ? Math.round(totalSales / orders.length) : 0,
        recentOrders: orders.slice(0, 7)
      };
    }
  }
};

export default orderService;
