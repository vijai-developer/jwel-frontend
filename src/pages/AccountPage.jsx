import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/CartContext';
import { orderService } from '../services/orderService';
import authService from '../services/authService';
import { 
  Crown, 
  Package, 
  Truck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  ShoppingBag, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Search,
  RefreshCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const { setSelectedOrderForInvoice, setCurrentView, showToast, formatPrice } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderToCancelModal, setOrderToCancelModal] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Profile Editor state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password update state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [fetchedOrders, fetchedProfile] = await Promise.all([
        orderService.getMyOrders().catch(e => {
          console.warn('Orders fetch error:', e);
          return [];
        }),
        authService.getProfile().catch(e => {
          console.warn('Profile fetch error:', e);
          return null;
        })
      ]);

      setOrders(fetchedOrders || []);
      if (fetchedProfile) {
        setProfile(fetchedProfile);
        setProfileForm({
          name: fetchedProfile.name || '',
          phone: fetchedProfile.phone || '',
          address: fetchedProfile.address || '',
          city: fetchedProfile.city || '',
          state: fetchedProfile.state || '',
          pincode: fetchedProfile.pincode || ''
        });
      }
      if (isManual) {
        showToast('Vault history synchronized.');
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile(profileForm);
      setProfile(prev => ({ ...prev, ...updated }));
      setIsEditingProfile(false);
      showToast('✨ Vault profile saved successfully.');
    } catch (err) {
      showToast(err.message || '⚠️ Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('⚠️ New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('⚠️ Passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      showToast('🔒 Security password changed successfully.');
    } catch (err) {
      showToast(err.message || '⚠️ Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of vault.');
    navigate('/');
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancelModal) return;
    setIsCancelling(true);
    const orderId = orderToCancelModal.id;
    const orderCode = orderToCancelModal.orderCode || `SJ-ORD-${orderId}`;

    try {
      await orderService.updateOrderStatus(orderId, 'Cancelled');

      // Update state in place immediately
      setOrders(prev => prev.map(o => {
        if (o.id === orderId || o.orderCode === orderCode) {
          return { ...o, status: 'Cancelled', paymentStatus: 'Cancelled' };
        }
        return o;
      }));

      // Also update local storage vault cache
      if (currentUser?.email) {
        const key = `sushma_vault_orders_${currentUser.email.toLowerCase()}`;
        const cached = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = cached.map(o => {
          if (o.id === orderId || o.orderCode === orderCode) {
            return { ...o, status: 'Cancelled', paymentStatus: 'Cancelled' };
          }
          return o;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      }

      showToast(`Order ${orderCode} has been cancelled.`);
      setOrderToCancelModal(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast('Could not cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const s = (status || 'In Progress').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
    if (s.includes('cancel')) return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
    return 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const idMatch = (o.orderCode || o.id || '').toString().toLowerCase().includes(q);
    const itemMatch = o.items && o.items.some(item => (item.productName || item.name || '').toLowerCase().includes(q));
    return idMatch || itemMatch;
  });

  const totalSpent = orders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] pb-24 pt-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Atelier Client Banner */}
        <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#C5A059]/10 via-[#F5E6D3]/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111111] to-[#2C2E2B] text-[#E5C992] flex items-center justify-center font-bold text-xl shadow-md border border-[#C5A059]/30">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif text-[#111111]">
                    {profile?.name || currentUser?.name || 'Valued Client'}
                  </h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8DFD1] text-[#8C6D31] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Private Client
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                  <span>{profile?.email || currentUser?.email}</span>
                  {profile?.phone && <span>• {profile.phone}</span>}
                </p>
              </div>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
              <div className="text-center md:text-right">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Purchased Pieces</span>
                <span className="text-xl font-bold font-serif text-[#111111]">{orders.length} Orders</span>
              </div>
              <div className="text-center md:text-right border-l border-stone-200 pl-6">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Portfolio Value</span>
                <span className="text-xl font-bold font-serif text-[#B8935F]">₹{totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors ml-2"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-[#E5C992] shadow-sm'
                  : 'text-stone-600 hover:text-[#111111] hover:bg-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Acquisitions & Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#111111] text-[#E5C992] shadow-sm'
                  : 'text-stone-600 hover:text-[#111111] hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Client Concierge & Profile</span>
            </button>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#B8935F] px-3 py-1.5 rounded-lg border border-stone-200 hover:border-[#B8935F] bg-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#B8935F]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* 3. Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">

            {/* Search Bar */}
            {orders.length > 0 && (
              <div className="flex items-center gap-3 bg-white border border-[#E8DFD1] rounded-2xl px-4 py-2.5 max-w-md shadow-2xs">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by Order Code, Piece name, or Waybill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-[#111111] bg-transparent focus:outline-none"
                />
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border border-[#E8DFD1] rounded-3xl p-6 animate-pulse space-y-4">
                    <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                    <div className="h-16 bg-stone-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              /* Empty State */
              <div className="bg-white border border-[#E8DFD1] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF0E4] border border-[#E8DFD1] text-[#C5A059] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-[#111111]">
                  {searchQuery ? 'No Matching Orders' : 'Your Jewellery Vault is Empty'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {searchQuery 
                    ? 'No orders match your search query. Try another keyword.' 
                    : 'You have not placed any orders yet. Discover our signature fine diamonds and heirloom pieces.'}
                </p>
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-6 py-3 bg-[#111111] text-[#E5C992] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-stone-900 transition-all cursor-pointer"
                >
                  Explore Fine Catalog
                </button>
              </div>
            ) : (
              /* Orders List */
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const orderCode = order.orderCode || `SJ-ORD-${order.id}`;
                  const orderDateFormatted = order.orderDate 
                    ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Recently Placed';

                  const itemsList = order.items && order.items.length > 0 ? order.items : [];

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-6"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-lg text-[#111111] tracking-wide">
                              {orderCode}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            Placed on {orderDateFormatted} • Paid via {order.paymentMethod || 'Online'}
                          </p>
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center gap-2">
                          {order.status === 'Delivered' ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Delivered</span>
                            </span>
                          ) : order.status === 'Cancelled' ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded-xl">
                              <span>Cancelled</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl">
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              <span>In Progress</span>
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setSelectedOrderForInvoice(order);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#B8935F]" />
                            <span>Invoice</span>
                          </button>

                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => setOrderToCancelModal(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                              title="Cancel this order"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-stone-100">
                        {itemsList.map((item, idx) => (
                          <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={item.image || '/images/ring_detail.jpg'}
                                alt={item.productName || item.name}
                                className="w-14 h-14 object-cover rounded-xl border border-stone-200 bg-stone-50"
                                onError={(e) => { e.target.src = '/images/ring_detail.jpg'; }}
                              />
                              <div>
                                <h4 className="text-xs font-bold text-[#111111]">
                                  {item.productName || item.name}
                                </h4>
                                <p className="text-[11px] text-stone-500 mt-0.5">
                                  Qty: {item.quantity || 1}
                                  {item.selectedSize && ` • Size: ${item.selectedSize}`}
                                  {item.metalFinish && ` • ${item.metalFinish}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold font-serif text-[#111111]">
                                {formatPrice ? formatPrice((item.price || 0) * (item.quantity || 1)) : `₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping & Payment Footer */}
                      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-[#FAF8F5] -mx-6 -mb-6 p-4 rounded-b-3xl">
                        <div className="flex items-center gap-2 text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-[#B8935F] flex-shrink-0" />
                          <span className="truncate max-w-md">
                            Delivery to: {order.shippingAddress || order.city || 'Private Client Address'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 font-medium">
                          <span className="text-stone-500 text-[11px]">
                            Payment: <strong className="text-stone-800">{order.paymentMethod || 'Cash on Delivery (COD)'}</strong>
                          </span>
                          <span className="font-bold font-serif text-sm text-[#B8935F]">
                            Total: {formatPrice ? formatPrice(order.finalAmount || order.totalAmount || 0) : `₹${(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Client Concierge & Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interactive Vault Registry Credentials */}
            <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-base text-[#111111]">Personal Profile & Delivery Address</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-semibold text-[#8C6D31] hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Building, street, landmark"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">State</label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex-1 py-2.5 bg-[#111111] text-[#E5C992] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-900 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-bold">Client Name</span>
                    <p className="font-semibold text-stone-800 text-sm mt-0.5">{profile?.name || currentUser?.name || '—'}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-bold">Email Address</span>
                    <p className="font-semibold text-stone-800 text-sm mt-0.5">{profile?.email || currentUser?.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-bold">Contact Phone</span>
                    <p className="font-semibold text-stone-800 text-sm mt-0.5">{profile?.phone || 'Not recorded'}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-bold">Default Delivery Address</span>
                    <p className="font-semibold text-stone-800 text-xs mt-0.5">
                      {profile?.address ? `${profile.address}, ${profile.city || ''} ${profile.state || ''} - ${profile.pincode || ''}` : 'No address saved yet'}
                    </p>
                  </div>
                </div>
              )}

              {/* Password Section Toggle */}
              <div className="pt-4 border-t border-stone-100">
                {!showPasswordSection ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(true)}
                    className="text-xs font-semibold text-stone-600 hover:text-[#111111] underline transition-colors cursor-pointer"
                  >
                    Change Security Password ➔
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-3 pt-2 text-xs">
                    <span className="font-bold text-stone-800 block">Change Account Password</span>
                    <input
                      type="password"
                      required
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <input
                      type="password"
                      required
                      placeholder="New Password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="flex-1 py-2 bg-[#111111] text-[#E5C992] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-900 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {savingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordSection(false)}
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Atelier Concierge Privileges */}
            <div className="bg-gradient-to-br from-[#FAF0E4] to-[#F5E6D3] border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFD1]">
                <ShieldCheck className="w-4 h-4 text-[#8C6D31]" />
                <h3 className="font-serif font-bold text-base text-[#8C6D31]">Private Client Privileges</h3>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Lifetime Manufacturing Warranty on all fine gold settings.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Complimentary annual ultrasonic cleaning & prong inspection.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Priority concierge dispatch via BlueDart Armored Transit.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Dedicated jewellery advisor assistance & custom sizing.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#E8DFD1]/60">
                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full py-2.5 bg-[#111111] text-[#E5C992] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-stone-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Acquire New Piece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {orderToCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#111111]">
                Cancel Order {orderToCancelModal.orderCode || `SJ-ORD-${orderToCancelModal.id}`}?
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Are you sure you wish to cancel this fine jewellery order? Our atelier will halt handcrafted preparation and the order status will be updated to <strong className="text-rose-700">Cancelled</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setOrderToCancelModal(null)}
                disabled={isCancelling}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isCancelling ? (
                  <span>Cancelling...</span>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
