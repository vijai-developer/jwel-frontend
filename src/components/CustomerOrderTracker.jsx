import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  PhoneCall,
  Crown
} from 'lucide-react';

const TRACKING_STEPS = [
  'Placed',
  'Quality Checked',
  'Packed',
  'Dispatched',
  'Out for Delivery',
  'Delivered'
];

export const CustomerOrderTracker = () => {
  const [searchParams] = useSearchParams();
  const { orders, setSelectedOrderForInvoice } = useShop();

  const [searchOrderId, setSearchOrderId] = useState('');
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Auto-load order if orderId query parameter is present in URL
  useEffect(() => {
    const paramOrderId = searchParams.get('orderId');
    if (paramOrderId) {
      setSearchOrderId(paramOrderId);
      findAndSetOrder(paramOrderId);
    }
  }, [searchParams, orders]);

  const findAndSetOrder = async (query) => {
    if (!query) return;
    const q = query.trim().toLowerCase();

    // 1. Check in CartContext orders
    const foundLocal = orders.find(o => 
      (o.orderCode && o.orderCode.toLowerCase() === q) ||
      (o.id && o.id.toString().toLowerCase() === q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === q)
    );

    if (foundLocal) {
      setActiveOrder(foundLocal);
      setSearchError('');
      return;
    }

    // 2. Fetch from backend
    setLoadingSearch(true);
    setSearchError('');
    try {
      const fetched = await orderService.getOrderById(query.trim());
      if (fetched) {
        setActiveOrder(fetched);
      } else {
        setSearchError(`No order found matching "${query}". Please check your order code.`);
      }
    } catch (err) {
      setSearchError(`No order found matching "${query}".`);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    findAndSetOrder(searchOrderId);
  };

  const getTimeline = (order) => {
    if (order.timeline && Array.isArray(order.timeline) && order.timeline.length > 0) {
      return order.timeline;
    }

    const currentStatus = (order.status || 'Processing').toLowerCase();
    let currentIdx = 0;
    if (currentStatus.includes('quality')) currentIdx = 1;
    else if (currentStatus.includes('packed')) currentIdx = 2;
    else if (currentStatus.includes('dispatch') || currentStatus.includes('shipped')) currentIdx = 3;
    else if (currentStatus.includes('transit') || currentStatus.includes('delivery')) currentIdx = 4;
    else if (currentStatus.includes('delivered')) currentIdx = 5;

    return TRACKING_STEPS.map((step, idx) => ({
      status: step,
      time: idx <= currentIdx ? (idx === currentIdx ? 'In Progress' : 'Completed') : 'Pending',
      done: idx <= currentIdx
    }));
  };

  const activeTimeline = activeOrder ? getTimeline(activeOrder) : [];
  const activeOrderCode = activeOrder ? (activeOrder.orderCode || `SJ-ORD-${activeOrder.id}`) : '';
  const orderDateFormatted = activeOrder && (activeOrder.orderDate || activeOrder.date)
    ? new Date(activeOrder.orderDate || activeOrder.date).toLocaleString('en-IN')
    : 'Recently Placed';

  const itemsList = activeOrder && activeOrder.items ? activeOrder.items : [];
  const shippingAddressText = activeOrder ? (activeOrder.shippingAddress || activeOrder.customer?.address || activeOrder.city || 'Private Client Address') : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#1C1917]">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B8935F] font-medium block">
          Concierge Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
          Track Your Heirloom Shipment
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto font-sans leading-relaxed">
          Enter your Sushma Jewels Order Code (e.g. SJ-ORD-91464) or Waybill to inspect real-time insured transit & hallmark dispatch status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order Code (e.g., SJ-ORD-91464)"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EADFC9] rounded-none py-3 pl-10 pr-4 text-xs text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-[#B8935F]"
          />
          <Search className="w-4 h-4 text-[#B8935F] absolute left-3.5 top-3.5" />
        </div>

        <button 
          type="submit" 
          disabled={loadingSearch}
          className="bg-[#1C1917] text-[#FAF7F2] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#B8935F] transition-colors cursor-pointer disabled:opacity-50"
        >
          {loadingSearch ? 'Locating...' : 'Track'}
        </button>
      </form>

      {searchError && (
        <div className="max-w-md mx-auto p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl text-center">
          {searchError}
        </div>
      )}

      {/* Recent Orders Quick Buttons */}
      {orders.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-[#B8935F] font-medium uppercase tracking-wider text-[11px]">Recent Orders:</span>
          {orders.slice(0, 5).map(o => {
            const code = o.orderCode || `SJ-ORD-${o.id}`;
            const isActive = activeOrder && (activeOrder.id === o.id || activeOrder.orderCode === code);
            return (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`px-3 py-1 text-xs tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#1C1917] text-[#FAF7F2]' 
                    : 'bg-[#FAF7F2] border border-[#EADFC9] text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                {code} ({o.status || 'Processing'})
              </button>
            );
          })}
        </div>
      )}

      {/* Active Order Card */}
      {activeOrder && (
        <div className="bg-[#FAF7F2] p-6 sm:p-8 border border-[#EADFC9] space-y-8 rounded-2xl shadow-xs">
          
          {/* Top Order Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#EADFC9]">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#B8935F]" />
                <span className="text-xl font-serif text-[#1C1917]">{activeOrderCode}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-medium border ${
                  activeOrder.status === 'Delivered' 
                    ? 'bg-emerald-950/10 border-emerald-800 text-emerald-900' 
                    : activeOrder.status === 'Shipped' || activeOrder.status === 'Dispatched'
                    ? 'bg-purple-950/10 border-purple-800 text-purple-900' 
                    : 'bg-amber-950/10 border-amber-800 text-amber-900'
                }`}>
                  ● {activeOrder.status || 'Processing'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Placed on: {orderDateFormatted} | Payment: {activeOrder.paymentMethod || 'Online Verified'}
              </p>
            </div>

            <button
              onClick={() => setSelectedOrderForInvoice(activeOrder)}
              className="px-4 py-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7F2] text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Insured Certificate & Invoice</span>
            </button>
          </div>

          {/* Courier & Tracking Waybill */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F2ECE1] p-5 border border-[#EADFC9] text-xs rounded-xl">
            <div>
              <span className="text-stone-500 uppercase tracking-wider text-[10px] block mb-1">Logistics Partner</span>
              <strong className="text-[#1C1917] font-serif text-sm">{activeOrder.courier || 'BlueDart Armored Transit'}</strong>
            </div>
            <div>
              <span className="text-stone-500 uppercase tracking-wider text-[10px] block mb-1">AWB Tracking Waybill</span>
              <strong className="font-mono text-sm text-[#1C1917]">{activeOrder.trackingNumber || 'BD-PENDING-IN'}</strong>
            </div>
            <div>
              <span className="text-stone-500 uppercase tracking-wider text-[10px] block mb-1">Destination Atelier Address</span>
              <p className="truncate text-stone-700 font-medium">{shippingAddressText}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[#B8935F] uppercase tracking-widest">Live Delivery Trajectory</h3>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {activeTimeline.map((stepItem, idx) => (
                <div 
                  key={idx}
                  className={`p-3 border flex flex-col items-center text-center space-y-2 transition-all rounded-lg ${
                    stepItem.done 
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]' 
                      : 'bg-[#F2ECE1] border-[#EADFC9] text-stone-400'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    stepItem.done ? 'bg-[#B8935F] text-[#1C1917]' : 'border border-stone-400'
                  }`}>
                    {stepItem.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="text-xs font-serif">{stepItem.status}</span>
                  <span className="text-[10px] opacity-70 font-sans">{stepItem.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Jewellery */}
          <div className="space-y-3 pt-4 border-t border-[#EADFC9]">
            <h4 className="text-xs font-semibold text-[#B8935F] uppercase tracking-widest">Vault Items En Route</h4>
            <div className="space-y-2">
              {itemsList.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-[#F2ECE1] p-3.5 border border-[#EADFC9] text-xs rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image || '/images/ring_detail.jpg'} 
                      alt={item.productName || item.name} 
                      className="w-12 h-12 object-cover rounded-md" 
                      onError={(e) => { e.target.src = '/images/ring_detail.jpg'; }}
                    />
                    <div>
                      <span className="font-serif text-sm block text-[#1C1917]">{item.productName || item.name}</span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                        Qty: {item.quantity || 1} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </span>
                    </div>
                  </div>
                  <span className="font-serif font-semibold text-sm text-[#1C1917]">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CustomerOrderTracker;
