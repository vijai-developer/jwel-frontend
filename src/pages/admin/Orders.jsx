import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { 
  Crown,
  Search, 
  Filter, 
  Eye, 
  Printer, 
  RefreshCw, 
  Truck, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  ArrowUpDown,
  Download,
  AlertCircle
} from 'lucide-react';

export const Orders = () => {
  const { updateOrderStatus: contextUpdateOrderStatus, setSelectedOrderForInvoice, showToast } = useCart();

  // State from mock API layer (orderService)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'amount-high', 'amount-low'

  // Fetch all orders using orderService.getAllOrders()
  const fetchOrders = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data || []);
      if (isManual) {
        showToast('✨ Orders synchronized with order service.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('⚠️ Failed to load orders.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      if (contextUpdateOrderStatus) {
        contextUpdateOrderStatus(orderId, newStatus);
      }
      
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const updatedTimeline = o.timeline ? o.timeline.map(t => {
            if (t.status === newStatus || (newStatus === 'Shipped' && t.status === 'Dispatched')) {
              return { ...t, done: true, time: 'Just now' };
            }
            return t;
          }) : [];
          return { ...o, status: newStatus, timeline: updatedTimeline };
        }
        return o;
      }));

      if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
        setSelectedOrderForModal(prev => ({ ...prev, status: newStatus }));
      }

      showToast(`Order ${orderId} updated to ${newStatus}`);
    } catch (e) {
      showToast('⚠️ Error updating order status.');
    }
  };

  // Filter & sort logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Status Filter
      if (statusFilter !== 'All') {
        const s = (order.status || 'In Progress').toLowerCase();
        if (statusFilter === 'In Progress') {
          if (!s.includes('progress') && !s.includes('processing') && !s.includes('pending') && !s.includes('placed')) {
            return false;
          }
        } else if (statusFilter === 'Delivered') {
          if (!s.includes('delivered')) return false;
        } else if (statusFilter === 'Cancelled') {
          if (!s.includes('cancel')) return false;
        }
      }

      // 2. Search by Order ID or Customer (Name, Phone, Email, City)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchId = order.id?.toLowerCase().includes(query);
        const matchName = order.customer?.name?.toLowerCase().includes(query);
        const matchPhone = order.customer?.phone?.includes(query);
        const matchEmail = order.customer?.email?.toLowerCase().includes(query);
        const matchCity = order.customer?.city?.toLowerCase().includes(query);
        const matchTracking = order.trackingNumber?.toLowerCase().includes(query);

        if (!matchId && !matchName && !matchPhone && !matchEmail && !matchCity && !matchTracking) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortOrder === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortOrder === 'amount-high') return (b.finalAmount || b.totalAmount || 0) - (a.finalAmount || a.totalAmount || 0);
      if (sortOrder === 'amount-low') return (a.finalAmount || a.totalAmount || 0) - (b.finalAmount || b.totalAmount || 0);
      return 0;
    });
  }, [orders, statusFilter, searchQuery, sortOrder]);

  const stats = useMemo(() => {
    const totalCount = orders.length;
    const inProgressCount = orders.filter(o => {
      const s = (o.status || 'In Progress').toLowerCase();
      return s.includes('progress') || s.includes('processing') || s.includes('pending') || s.includes('placed');
    }).length;
    const deliveredCount = orders.filter(o => (o.status || '').toLowerCase().includes('delivered')).length;
    const cancelledCount = orders.filter(o => (o.status || '').toLowerCase().includes('cancel')).length;
    const totalGrossRevenue = orders.reduce((sum, o) => sum + (Number(o.finalAmount) || Number(o.totalAmount) || 0), 0);

    return { totalCount, inProgressCount, deliveredCount, cancelledCount, totalGrossRevenue };
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#C5A059] border-t-transparent animate-spin"></div>
        <p className="text-xs font-bold text-[#8C6D31]">Fetching Orders from orderService...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#2C2E2B] font-sans pb-16">
      
      {/* 1. Header Banner & Quick Counters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#E8DFD1]">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#C5A059]" />
            <h1 className="text-2xl sm:text-3xl font-bold font-royal gold-text-gradient">
              Customer Orders & Fulfillment Hub
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage boutique client orders, update In Progress & Delivered statuses, and issue tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#FAF6F0] border border-[#E8DFD1] text-[#8C6D31] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C5A059]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Orders'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('All')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'All' ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20' : 'border-[#E8DFD1]'
          }`}
        >
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">All Orders</span>
          <p className="text-2xl font-extrabold text-[#2C2E2B] mt-1">{stats.totalCount}</p>
          <span className="text-[10px] text-[#8C6D31] font-semibold">₹{stats.totalGrossRevenue.toLocaleString('en-IN')} Total</span>
        </div>

        <div 
          onClick={() => setStatusFilter('In Progress')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'In Progress' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-[#E8DFD1]'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">In Progress</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.inProgressCount}</p>
          <span className="text-[10px] text-gray-500">Being Prepared & Packed</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Delivered')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Delivered' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-[#E8DFD1]'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Delivered</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.deliveredCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">COD Collected</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Cancelled')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Cancelled' ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-[#E8DFD1]'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Cancelled</span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{stats.cancelledCount}</p>
          <span className="text-[10px] text-rose-500">Void / Cancelled</span>
        </div>
      </div>

      {/* 3. Search Bar & Status Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DFD1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search by Order ID or Customer */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8C6D31] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF6F0] focus:bg-white border border-[#E8DFD1] focus:border-[#C5A059] rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#2C2E2B] placeholder-gray-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'In Progress', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#C5A059] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-gray-600 hover:bg-[#F3E3CD] hover:text-[#8C6D31]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E8DFD1]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6D31]" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#2C2E2B] focus:outline-none cursor-pointer"
            >
              <option value="newest">Date: Newest First</option>
              <option value="oldest">Date: Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>

        </div>

      </div>

      {/* 4. Main Orders Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[720px]">
            <thead className="bg-[#FAF6F0] text-[#8C6D31] font-bold border-b border-[#E8DFD1]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Jewellery Items</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Delivery Destination</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD1]/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm text-gray-500">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing your search keywords or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FAF6F0]/80 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#8C6D31] block text-sm">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {order.date ? new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                      </span>
                    </td>

                    {/* Customer Details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8C6D31] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {order.customer?.name ? order.customer.name.slice(0, 2).toUpperCase() : 'SJ'}
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-[#2C2E2B] truncate">{order.customer?.name || 'Customer'}</strong>
                          <span className="text-[10px] text-gray-500 block truncate">{order.customer?.phone}</span>
                          <span className="text-[10px] text-gray-400 block truncate max-w-[160px]">
                            {order.customer?.city || order.customer?.address || 'India'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Jewellery Items */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {order.items?.map((item, i) => (
                          <div key={i} className="text-[11px] text-gray-700 flex items-center gap-1.5 truncate max-w-[180px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] inline-block flex-shrink-0"></span>
                            <span className="truncate">{item.name}</span>
                            <span className="font-bold text-[#8C6D31] text-[10px]">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-[#2C2E2B] font-royal block">
                        ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                        {order.paymentMethod || 'Paid (UPI/Card)'}
                      </span>
                    </td>

                    {/* Delivery Destination */}
                    <td className="py-4 px-4 text-[11px] text-gray-700 max-w-[200px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="truncate font-semibold text-stone-800">
                            {order.city || order.customer?.city || 'Local Delivery'}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate mt-0.5">
                            {order.shippingAddress || order.customer?.address || 'Doorstep Address'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown (In Progress, Delivered, Cancelled) */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status || 'In Progress'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer transition-all ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions: View Details Modal & Print Invoice */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderForModal(order)}
                          className="p-2 text-[#8C6D31] hover:bg-[#FAF0E4] rounded-xl border border-[#E8DFD1] transition-all cursor-pointer shadow-2xs"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-2 text-[#C5A059] hover:bg-[#FAF0E4] rounded-xl border border-[#E8DFD1] transition-all cursor-pointer shadow-2xs"
                          title="Generate Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. VIEW ORDER DETAILS MODAL */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-[#E8DFD1] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#FAF0E4] border-b border-[#E8DFD1] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-lg font-bold font-royal text-[#8C6D31]">
                    Order Details: {selectedOrderForModal.id}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {selectedOrderForModal.date ? new Date(selectedOrderForModal.date).toLocaleString('en-IN') : 'Recently'}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Customer & Shipping Information Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D31]">
                    <User className="w-4 h-4" />
                    <span>Customer Profile</span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p className="font-bold text-sm text-[#2C2E2B]">{selectedOrderForModal.customer?.name}</p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {selectedOrderForModal.customer?.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {selectedOrderForModal.customer?.email}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D31]">
                    <MapPin className="w-4 h-4" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedOrderForModal.customer?.address}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                    Insured BlueDart Delivery
                  </span>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#8C6D31] uppercase tracking-wider">
                  Purchased Jewellery Pieces ({selectedOrderForModal.items?.length || 0})
                </h4>

                <div className="space-y-2">
                  {selectedOrderForModal.items?.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8DFD1]" 
                        />
                        <div>
                          <h5 className="text-xs font-bold text-[#2C2E2B]">{item.name}</h5>
                          <span className="text-[10px] text-gray-500">
                            Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#8C6D31]">
                          ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          ₹{Number(item.price).toLocaleString('en-IN')} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-2xl bg-[#FAF0E4] border border-[#E8DFD1] space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2C2E2B]">₹{(selectedOrderForModal.totalAmount || selectedOrderForModal.finalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-bold text-[#8C6D31]">{selectedOrderForModal.paymentMethod || 'Online'}</span>
                </div>
                <div className="pt-2 border-t border-[#E8DFD1] flex justify-between items-center text-sm font-bold text-[#2C2E2B]">
                  <span>Total Amount Paid</span>
                  <span className="text-base font-black text-[#8C6D31] font-royal">
                    ₹{(selectedOrderForModal.finalAmount || selectedOrderForModal.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Fulfillment Status Updater inside Modal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C6D31] uppercase tracking-wider block">
                  Update Fulfillment Status
                </label>
                <div className="flex items-center gap-3">
                  {['In Progress', 'Delivered', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrderForModal.id, status)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedOrderForModal.status === status
                          ? 'bg-[#8C6D31] text-white border-[#8C6D31] shadow-xs'
                          : 'bg-white text-gray-700 border-[#E8DFD1] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF6F0] border-t border-[#E8DFD1] flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedOrderForInvoice(selectedOrderForModal);
                  setSelectedOrderForModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FAF0E4] border border-[#E8DFD1] text-[#8C6D31] text-xs font-bold hover:bg-[#F3E3CD] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Generate Tax Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#2C2E2B] hover:bg-[#1A1C19] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
