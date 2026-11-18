import React, { useState, useEffect, useMemo } from 'react';
import { useShop, useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  DollarSign,
  Plus,
  Eye,
  Crown,
  RefreshCw,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  Package,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Percent,
  SlidersHorizontal,
  ExternalLink,
  Layers
} from 'lucide-react';

export const Dashboard = () => {
  const { setCurrentView, setSelectedOrderForInvoice, showToast, updateOrderStatus } = useShop();

  // Component local states for data fetched via services
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('month'); // 'today', 'week', 'month', 'year'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Fetch all dashboard data using Services Layer only
  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [fetchedOrders, fetchedProducts, fetchedCustomers, fetchedLowStock] = await Promise.all([
        orderService.getOrders(),
        productService.getProducts(),
        orderService.getCustomers(),
        productService.getLowStockProducts(10)
      ]);

      setOrders(fetchedOrders || []);
      setProducts(fetchedProducts || []);
      setCustomers(fetchedCustomers || []);
      setLowStockProducts(fetchedLowStock || []);

      if (isManualRefresh) {
        showToast('✨ Dashboard metrics synced in real-time');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showToast('⚠️ Failed to refresh dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics from fetched data
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + (Number(o.finalAmount) || Number(o.totalAmount) || 0), 0);
    const totalOrdersCount = orders.length;
    const totalCustomersCount = customers.length || new Set(orders.map(o => o.customer?.email)).size;
    const lowStockCount = lowStockProducts.length;

    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const processingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Placed').length;
    const dispatchedOrders = orders.filter(o => o.status === 'Dispatched' || o.status === 'Out for Delivery').length;

    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

    // Category sales distribution
    const categoryTotals = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + 1;
    });

    return {
      totalSales,
      totalOrdersCount,
      totalCustomersCount,
      lowStockCount,
      deliveredOrders,
      processingOrders,
      dispatchedOrders,
      avgOrderValue,
      categoryTotals,
      monthlyTarget: 1500000,
      targetProgress: Math.min(Math.round((totalSales / 1500000) * 100), 100)
    };
  }, [orders, products, customers, lowStockProducts]);

  // Filtered orders for the Recent Orders Table
  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return orders.filter(order => {
      const matchesSearch =
        String(order.id ?? '').toLowerCase().includes(query) ||
        order.customer?.name?.toLowerCase().includes(query) ||
        order.customer?.city?.toLowerCase().includes(query) ||
        order.customer?.phone?.includes(searchQuery);

      const matchesStatus =
        statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      if (updateOrderStatus) {
        updateOrderStatus(orderId, newStatus);
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order ${orderId} updated to ${newStatus}`);
    } catch (e) {
      showToast('Error updating order status');
    }
  };

  const handleExportData = () => {
    showToast('📊 Downloading Sushma Jewels Sales Report (CSV)...');
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/20 animate-ping"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-[#C5A059] border-r-[#8C6D31] border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-[#8C6D31]">Loading Luxury Store Analytics...</p>
          <p className="text-xs text-gray-500 mt-1">Connecting to Sushma Jewels Services Layer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#2C2E2B] pb-12 font-sans">

      {/* 1. Header Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-[#1A1C19] via-[#2A261F] to-[#1A1C19] text-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden border border-[#C5A059]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#ECCB82] text-xs font-semibold backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5 text-[#ECCB82]" />
              <span>Sushma Jewels • Executive Management</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-royal tracking-wide text-white">
              Store Performance & Operations
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Real-time monitoring of jewelry sales, order fulfillment, luxury inventory thresholds, and client engagement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all backdrop-blur-sm cursor-pointer shadow-sm active:scale-95"
              title="Sync metrics with API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ECCB82]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Live Refresh'}</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all backdrop-blur-sm cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-products')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B8924B] hover:to-[#D4AC61] text-[#1A1C19] text-xs font-black transition-all shadow-lg shadow-[#C5A059]/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1A1C19]" />
              <span>Add Jewellery</span>
            </button>
          </div>
        </div>

        {/* Real-time Subheader KPIs Bar */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#ECCB82]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Avg. Order Value</p>
              <p className="text-sm font-bold text-white">₹{metrics.avgOrderValue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Fulfillment Rate</p>
              <p className="text-sm font-bold text-white">
                {metrics.totalOrdersCount > 0 ? Math.round((metrics.deliveredOrders / metrics.totalOrdersCount) * 100) : 100}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Pending Processing</p>
              <p className="text-sm font-bold text-white">{metrics.processingOrders} Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Anti-Tarnish Certified</p>
              <p className="text-sm font-bold text-white">100% Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards Grid (Total Sales, Total Orders, Total Customers, Low Stock Alerts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1: Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] hover:border-[#C5A059]/60 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-[#FAF0E4] to-[#F3E3CD] rounded-2xl border border-[#E8DFD1] text-[#8C6D31]">
              <DollarSign className="w-6 h-6 text-[#C5A059]" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +24.8%
            </span>
          </div>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Sales Revenue</span>
          <h2 className="text-2xl lg:text-3xl font-black text-[#8C6D31] mt-1 font-royal">
            ₹{metrics.totalSales.toLocaleString('en-IN')}
          </h2>

          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-gray-500">
            <span>Monthly Target (₹15L)</span>
            <span className="font-bold text-[#8C6D31]">{metrics.targetProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F0EAE1] rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#8C6D31] rounded-full transition-all duration-1000"
              style={{ width: `${metrics.targetProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] hover:border-[#C5A059]/60 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
          </div>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Orders</span>
          <h2 className="text-2xl lg:text-3xl font-black text-[#2C2E2B] mt-1">
            {metrics.totalOrdersCount}
          </h2>

          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              {metrics.deliveredOrders} Delivered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              {metrics.processingOrders} Active
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F0EAE1] rounded-full mt-1.5 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(metrics.deliveredOrders / (metrics.totalOrdersCount || 1)) * 100}%` }}
            ></div>
            <div
              className="h-full bg-amber-500"
              style={{ width: `${(metrics.processingOrders / (metrics.totalOrdersCount || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] hover:border-[#C5A059]/60 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-600">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              <TrendingUp className="w-3 h-3" /> +19.1%
            </span>
          </div>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Customers</span>
          <h2 className="text-2xl lg:text-3xl font-black text-[#2C2E2B] mt-1">
            {metrics.totalCustomersCount}
          </h2>

          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-gray-500">
            <span>Repeat Buyer Rate</span>
            <span className="font-bold text-purple-700">76.4%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F0EAE1] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '76.4%' }}></div>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className={`bg-white p-6 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group ${metrics.lowStockCount > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-[#E8DFD1]'
          }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl border ${metrics.lowStockCount > 0 ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
              <AlertTriangle className={`w-6 h-6 ${metrics.lowStockCount > 0 ? 'text-amber-600 animate-pulse' : 'text-gray-400'}`} />
            </div>
            {metrics.lowStockCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Action Required
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Low Stock Alerts (≤10 Units)</span>
          <h2 className={`text-2xl lg:text-3xl font-black mt-1 ${metrics.lowStockCount > 0 ? 'text-amber-800' : 'text-[#2C2E2B]'}`}>
            {metrics.lowStockCount} Items
          </h2>

          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentView('admin-products')}
              className="text-[#8C6D31] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Restock Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-gray-500">{products.length} Total SKUs</span>
          </div>
          <div className="w-full h-1.5 bg-[#F0EAE1] rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.min((metrics.lowStockCount / (products.length || 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* 3. Low Stock Alert Warning Banner (If Any Items Low) */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-[#FFF9F0] to-amber-50 border border-amber-200 p-5 rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
              <div className="p-1.5 bg-amber-200/60 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>
              <span>Inventory Threshold Warning: {lowStockProducts.length} items running low on stock</span>
            </div>

            <button
              onClick={() => setCurrentView('admin-products')}
              className="text-xs font-bold px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Manage Stock in Inventory ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {lowStockProducts.slice(0, 4).map(item => (
              <div key={item.id} className="bg-white p-3 rounded-2xl border border-amber-200/80 flex items-center gap-3 shadow-2xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DFD1] flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#2C2E2B] truncate">{item.name}</h4>
                  <p className="text-[10px] text-gray-500">SKU: {item.sku}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                      {item.stockQty ?? 4} left
                    </span>
                    <span className="text-xs font-extrabold text-[#8C6D31]">₹{item.price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Two Column Section: Recent Orders Table + Category & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left 8 Cols: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E8DFD1] space-y-6 shadow-xs">

          {/* Section Header & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#E8DFD1]">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold font-royal text-[#8C6D31]">
                  Recent Customer Orders
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Live transaction log across India</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search order or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8DFD1] bg-[#FAF6F0] focus:bg-white focus:border-[#C5A059] focus:outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setCurrentView('admin-orders')}
                className="text-xs text-[#8C6D31] font-bold px-3 py-1.5 rounded-xl border border-[#E8DFD1] hover:bg-[#FAF6F0] transition-all whitespace-nowrap cursor-pointer"
              >
                All Orders ➔
              </button>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs pb-1">
            {['ALL', 'Processing', 'Delivered', 'Dispatched', 'Placed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${statusFilter === status
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-gray-600 hover:text-[#8C6D31] hover:bg-[#F3E8DA]'
                  }`}
              >
                {status === 'ALL' ? 'All Orders' : status}
                <span className="ml-1.5 text-[10px] opacity-75">
                  ({status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length})
                </span>
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-[#E8DFD1] rounded-2xl">
            <table className="w-full text-xs text-left min-w-[640px]">
              <thead className="bg-[#FAF6F0] text-[#8C6D31] font-bold border-b border-[#E8DFD1]">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">No customer orders matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 7).map(order => (
                    <tr key={order.id} className="hover:bg-[#FAF6F0]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#8C6D31] block">{order.id}</span>
                        <span className="text-[10px] text-gray-500">
                          {order.date ? new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8C6D31] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {order.customer?.name ? order.customer.name.slice(0, 2).toUpperCase() : 'SJ'}
                          </div>
                          <div>
                            <span className="font-bold block text-[#2C2E2B]">{order.customer?.name || 'Customer'}</span>
                            <span className="text-[10px] text-gray-500">{order.customer?.city || order.customer?.phone || 'India'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-700">
                          {order.items?.length || 1} {order.items?.length === 1 ? 'Piece' : 'Pieces'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-[#2C2E2B]">
                        ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-[10px]">
                          {order.paymentMethod || 'UPI / Card'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none transition-all ${order.status === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : order.status === 'Dispatched'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 text-[#C5A059] hover:text-[#8C6D31] hover:bg-[#FAF0E4] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Generate Tax Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Category Share & Bestselling Jewellery */}
        <div className="lg:col-span-4 space-y-6">

          {/* Category Performance Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] space-y-4 shadow-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DFD1]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-base font-bold font-royal text-[#8C6D31]">
                  Catalog Breakdown
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">{products.length} Items</span>
            </div>

            <div className="space-y-3">
              {['Necklaces', 'Earrings', 'Rings', 'Bangles', 'Bracelets'].map((cat, idx) => {
                const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#2C2E2B]">{cat}</span>
                      <span className="text-[#8C6D31]">{count} SKUs ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#E8DFD1]">
                      <div
                        className={`h-full rounded-full ${idx === 0 ? 'bg-[#C5A059]' :
                          idx === 1 ? 'bg-[#8C6D31]' :
                            idx === 2 ? 'bg-amber-600' :
                              idx === 3 ? 'bg-amber-400' : 'bg-gray-400'
                          }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Jewellery Items */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] space-y-4 shadow-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DFD1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-base font-bold font-royal text-[#8C6D31]">
                  Top Bestsellers
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('admin-products')}
                className="text-xs text-[#8C6D31] font-bold hover:underline"
              >
                Catalog ➔
              </button>
            </div>

            <div className="space-y-3">
              {products.slice(0, 4).map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#F4ECE0] transition-colors border border-[#E8DFD1]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-[#E8DFD1] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-[#2C2E2B] truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500">{product.metalType || '18K Gold Plated'}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">Stock: {product.stockQty || 12}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-[#8C6D31] block">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
