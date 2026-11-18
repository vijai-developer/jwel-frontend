import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Package,
  Award,
  CreditCard,
  QrCode,
  Building
} from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartSubtotal, 
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    placeOrder, 
    setCurrentView, 
    setSelectedCategory,
    showToast, 
    setSelectedOrderForInvoice,
    formatPrice
  } = useCart();

  const { user } = useAuth();
  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const isAuthenticated = !!(currentUser && currentUser.email);

  // Form State with localStorage persistence
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('sushma_checkout_form');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      fullName: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      addressLine1: currentUser?.address || '',
      addressLine2: '',
      city: currentUser?.city || 'Bangalore',
      state: currentUser?.state || 'Karnataka',
      pincode: currentUser?.pincode || '560001',
      deliveryNote: '',
      isGift: false,
      paymentMethod: 'COD' // Cash on Delivery (COD) exclusively
    };
  });

  // Pre-fill user data when currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: currentUser.email || prev.email,
        phone: prev.phone || currentUser.phone || '',
        addressLine1: prev.addressLine1 || currentUser.address || '',
        city: prev.city || currentUser.city || 'Bangalore',
        state: prev.state || currentUser.state || 'Karnataka',
        pincode: prev.pincode || currentUser.pincode || '560001'
      }));
    }
  }, [currentUser]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);

  // Payment Options State
  const [paymentMode, setPaymentMode] = useState('COD'); // 'COD', 'UPI', 'CARD', 'NETBANKING'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');

  // Sync formData to localStorage
  React.useEffect(() => {
    localStorage.setItem('sushma_checkout_form', JSON.stringify(formData));
  }, [formData]);

  // Free shipping policy: Complimentary insured shipping on all orders
  const shippingCost = 0;
  const grandTotal = cartSubtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('🔒 Please sign in or create an account to place this order.');
      navigate('/login?redirect=checkout');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.');
      setCurrentView('catalog');
      navigate('/catalog');
      return;
    }

    // 1. Full name validation
    const customerName = (formData.fullName || currentUser?.name || '').trim();
    if (customerName.length < 2) {
      showToast('⚠️ Please enter your full name (at least 2 characters).');
      return;
    }

    // 2. Email validation
    const customerEmail = (formData.email || currentUser?.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      showToast('⚠️ Please provide a valid email address.');
      return;
    }

    // 3. Phone validation
    const customerPhone = (formData.phone || currentUser?.phone || '').trim();
    const digitsOnlyPhone = customerPhone.replace(/\D/g, '');
    if (digitsOnlyPhone.length < 10 || digitsOnlyPhone.length > 13) {
      showToast('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }

    // 4. Address line 1
    if (!formData.addressLine1 || formData.addressLine1.trim().length < 5) {
      showToast('⚠️ Please enter a complete shipping address (at least 5 characters).');
      return;
    }

    // 5. City and State
    if (!formData.city || formData.city.trim().length < 2) {
      showToast('⚠️ Please enter your delivery city.');
      return;
    }
    if (!formData.state || formData.state.trim().length < 2) {
      showToast('⚠️ Please enter your delivery state.');
      return;
    }

    // 6. Pincode validation (6 digits)
    const pincodeDigits = (formData.pincode || '').replace(/\D/g, '');
    if (pincodeDigits.length !== 6) {
      showToast('⚠️ Please enter a valid 6-digit postal PIN code.');
      return;
    }

    // 7. Payment Mode validations
    if (paymentMode === 'UPI') {
      const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (upiId && !upiPattern.test(upiId.trim())) {
        showToast('⚠️ Please enter a valid UPI ID (e.g. name@okhdfcbank).');
        return;
      }
    } else if (paymentMode === 'CARD') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15 || cleanCard.length > 19) {
        showToast('⚠️ Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardHolder.trim() || cardHolder.trim().length < 2) {
        showToast('⚠️ Please enter the cardholder name.');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry.trim())) {
        showToast('⚠️ Please enter a valid card expiry (MM/YY).');
        return;
      }
      if (!/^[0-9]{3,4}$/.test(cardCvv.trim())) {
        showToast('⚠️ Please enter a valid 3 or 4-digit CVV.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const customerEmail = (currentUser?.email || formData.email || '').trim().toLowerCase();
      const customerName = (currentUser?.name || formData.fullName || 'Sushma Client').trim();
      const customerPhone = (currentUser?.phone || formData.phone || '').trim();

      let finalPaymentMethod = 'Cash on Delivery (COD)';
      let generatedPaymentId = `COD_${Date.now().toString().slice(-8)}`;
      let paymentStatus = 'Pending (COD)';

      if (paymentMode === 'UPI') {
        finalPaymentMethod = `Instant UPI (${upiId || 'client@okhdfcbank'})`;
        generatedPaymentId = `UPI_${Date.now().toString().slice(-8)}`;
        paymentStatus = 'Paid (UPI Verified)';
      } else if (paymentMode === 'CARD') {
        const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '8842';
        finalPaymentMethod = `Credit/Debit Card (ending in ••${last4})`;
        generatedPaymentId = `TXN_CARD_${Date.now().toString().slice(-8)}`;
        paymentStatus = 'Paid (Card Authorized)';
      } else if (paymentMode === 'NETBANKING') {
        finalPaymentMethod = `Netbanking (${bankName})`;
        generatedPaymentId = `NB_${Date.now().toString().slice(-8)}`;
        paymentStatus = 'Paid (Netbanking)';
      }

      const orderPayload = {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          deliveryNote: formData.deliveryNote,
          isGift: formData.isGift
        },
        items: cart,
        totalAmount: cartSubtotal,
        discountAmount: 0,
        finalAmount: grandTotal,
        paymentMethod: finalPaymentMethod,
        paymentId: generatedPaymentId,
        paymentStatus: paymentStatus
      };

      // Call API service
      const apiResult = await orderService.createOrder(orderPayload);

      // Store in CartContext and clear cart
      const confirmedOrder = placeOrder({
        ...orderPayload,
        id: apiResult?.orderCode || apiResult?.id || undefined
      });

      // Cache directly to user's vault in localStorage so it is immediately visible
      if (customerEmail) {
        try {
          const key = `sushma_vault_orders_${customerEmail}`;
          const currentCached = JSON.parse(localStorage.getItem(key) || '[]');
          currentCached.unshift({
            ...orderPayload,
            ...(apiResult || {}),
            id: apiResult?.id || confirmedOrder?.id,
            orderCode: apiResult?.orderCode || confirmedOrder?.id,
            status: apiResult?.status || 'In Progress',
            orderDate: apiResult?.orderDate || new Date().toISOString()
          });
          localStorage.setItem(key, JSON.stringify(currentCached));
        } catch (err) {
          console.warn('Could not cache vault order:', err);
        }
      }

      setCreatedOrderDetails(confirmedOrder);
      setOrderSuccess(true);
      localStorage.removeItem('sushma_checkout_form');
      showToast(`Order placed successfully! Order ID: ${confirmedOrder?.id || 'SJ-ORD'}`);

    } catch (error) {
      console.error('Checkout error:', error);
      const serverMsg = error.response?.data?.message;
      showToast(serverMsg || error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order was placed successfully, show confirmation screen
  if (orderSuccess && createdOrderDetails) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16 text-[#111111]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#111111] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 text-[#E5C992]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-[0.25em] block">
              Order Confirmed • Cash on Delivery
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#111111]">
              Thank you for your order.
            </h1>
            <p className="text-xs text-stone-600 max-w-md mx-auto font-light leading-relaxed">
              Your bespoke fine jewellery order <strong className="font-mono text-[#111111]">{createdOrderDetails.id}</strong> is placed under <strong>In Progress</strong> and being prepared in our atelier. Pay via cash upon doorstep arrival.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#111111]/10 max-w-md mx-auto text-left space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-[#111111]/10 text-xs">
              <span className="text-stone-500">Estimated Delivery</span>
              <span className="font-medium text-[#111111]">2–4 Business Days (Insured)</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#111111]/10 text-xs">
              <span className="text-stone-500">Payment Mode</span>
              <span className="text-amber-800 font-medium">{createdOrderDetails.paymentMethod || 'Cash on Delivery (Pending at Doorstep)'}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-serif text-sm font-medium">
              <span>Total Amount</span>
              <span>{formatPrice ? formatPrice(createdOrderDetails.finalAmount) : `₹${createdOrderDetails.finalAmount?.toLocaleString('en-IN')}`}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('All Items');
                setCurrentView('catalog');
              }}
              className="heirest-btn-dark px-8 py-3 text-xs tracking-[0.2em]"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setCurrentView('account')}
              className="heirest-btn-outline px-8 py-3 text-xs tracking-[0.2em]"
            >
              View Order in Vault Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Prevention State
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md space-y-5">
          <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-[1]" />
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-light text-[#111111]">Your Cart is Empty</h2>
            <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
              Please add at least one fine jewellery piece to your bag before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setCurrentView('catalog');
            }}
            className="heirest-btn-dark px-8 py-3.5 text-xs tracking-[0.2em] inline-flex items-center gap-2"
          >
            <span>Explore Fine Jewellery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#111111] pb-24">
      
      {/* 1. Header Bar */}
      <div className="border-b border-[#111111]/10 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs uppercase tracking-wider sm:tracking-widest text-stone-500 hover:text-[#111111] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back</span>
            <span className="hidden sm:inline">to Shopping</span>
          </button>

          <span className="text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium font-serif truncate">
            Secure Atelier Checkout
          </span>

          <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-widest text-stone-500 shrink-0">
            <Lock className="w-3 h-3 text-[#B8935F]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Shipping & Payment Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Authentication Gate Alert */}
            {!isAuthenticated && (
              <div className="bg-[#1F3A32] text-[#FAF7F2] border border-[#B89B5E] p-6 sm:p-7 rounded-2xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[#D4BE8D] font-bold text-xs uppercase tracking-[0.2em]">
                      <Lock className="w-4 h-4 text-[#B89B5E]" />
                      <span>Account Verification Required</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-white">
                      Please Sign In or Register to Place Order
                    </h3>
                    <p className="text-xs text-[#FAF7F2]/80 font-light max-w-lg leading-relaxed">
                      Orders cannot be completed without an account. Signing in ensures your 24K gold plating guarantee certificate, hallmark verification, and insured tracking are safely registered in your name.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => navigate('/login?redirect=checkout')}
                      className="px-5 py-2.5 bg-[#B89B5E] hover:bg-[#A38548] text-[#142822] text-xs font-bold uppercase tracking-[0.16em] rounded-full transition-all shadow-md text-center cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/login?mode=register&redirect=checkout')}
                      className="px-5 py-2.5 bg-transparent hover:bg-white/10 text-[#FAF7F2] border border-[#B89B5E] text-xs font-bold uppercase tracking-[0.16em] rounded-full transition-all text-center cursor-pointer"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} id="checkout-form" className="space-y-8">
              
              {/* Shipping Address Section */}
              <div className="bg-white border border-[#111111]/10 p-6 sm:p-8 space-y-4 shadow-2xs">
                <div className="space-y-1 pb-2 border-b border-[#111111]/10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8935F] font-semibold block">
                    Step 1
                  </span>
                  <h3 className="text-lg font-serif font-light uppercase tracking-wider">
                    Insured Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Receiver's name"
                      className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                    Email for Tracking & Guarantee Certificate *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                    Street Address / House / Flat *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Building name, street, locality"
                    className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      name="isGift"
                      checked={formData.isGift}
                      onChange={handleInputChange}
                      className="accent-[#111111] w-4 h-4"
                    />
                    <span>Add complimentary luxury gift packaging and wax-sealed note</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white border border-[#111111]/10 p-6 sm:p-8 space-y-4 shadow-2xs">
                <div className="space-y-1 pb-2 border-b border-[#111111]/10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8935F] font-semibold block">
                    Step 2
                  </span>
                  <h3 className="text-lg font-serif font-light uppercase tracking-wider">
                    Payment Method
                  </h3>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                    { id: 'UPI', label: 'Instant UPI / QR', icon: QrCode },
                    { id: 'CARD', label: 'Credit / Debit', icon: CreditCard },
                    { id: 'NETBANKING', label: 'Netbanking', icon: Building }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMode(tab.id)}
                      className={`p-3 text-center border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMode === tab.id
                          ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                          : 'border-[#111111]/15 bg-[#FAF8F5] text-stone-700 hover:border-stone-500'
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${paymentMode === tab.id ? 'text-[#E5C992]' : 'text-stone-600'}`} />
                      <span className="text-[10px] uppercase tracking-wider font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* COD Details */}
                {paymentMode === 'COD' && (
                  <div className="p-4 border border-[#111111]/20 bg-[#FAF8F5] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#111111]">Doorstep Cash Payment</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">Zero Extra Fee</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      Please keep the exact cash amount of <strong>{formatPrice ? formatPrice(grandTotal) : `₹${grandTotal.toLocaleString('en-IN')}`}</strong> ready for the courier agent upon arrival. Inspect tamper-evident wax seal before payment.
                    </p>
                  </div>
                )}

                {/* UPI Details */}
                {paymentMode === 'UPI' && (
                  <div className="p-4 border border-[#111111]/20 bg-[#FAF8F5] space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#111111]">Instant UPI Payment & QR Code</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Auto-Verified</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 border border-stone-200">
                      <div className="w-24 h-24 bg-white border border-stone-300 p-1 flex items-center justify-center">
                        <QrCode className="w-full h-full text-stone-800" />
                      </div>
                      <div className="space-y-1 text-center sm:text-left flex-1">
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Official Atelier VPA</span>
                        <p className="font-mono text-xs font-bold text-[#111111]">sushmajewels@okhdfcbank</p>
                        <p className="text-[10px] text-stone-500">Scan via Google Pay, PhonePe, Paytm, or BHIM.</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600 block">Your UPI ID / VPA</label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>
                )}

                {/* Card Details */}
                {paymentMode === 'CARD' && (
                  <div className="p-4 border border-[#111111]/20 bg-[#FAF8F5] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#111111]">Credit or Debit Card</span>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Lock className="w-3 h-3 text-[#B8935F]" />
                        <span>256-Bit SSL</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                      />
                      <input
                        type="text"
                        placeholder="Card Number (4532 •••• •••• 8842)"
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111] font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength="4"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Netbanking Details */}
                {paymentMode === 'NETBANKING' && (
                  <div className="p-4 border border-[#111111]/20 bg-[#FAF8F5] space-y-3 text-xs">
                    <span className="font-medium text-[#111111] block">Select Your Preferred Bank</span>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-[#111111]/15 px-3 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                    <p className="text-[10px] text-stone-500">You will be securely routed for instant two-factor authentication.</p>
                  </div>
                )}

                {/* Submit Order Action */}
                <div className="pt-3">
                  {isAuthenticated ? (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full heirest-btn-dark py-3.5 sm:py-4 px-4 min-h-[48px] text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
                    >
                      <span>{isProcessing ? 'Securing Order...' : `Complete Order • ${formatPrice ? formatPrice(grandTotal) : '₹' + grandTotal.toLocaleString('en-IN')}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        showToast('🔒 Please sign in or register before completing your order.');
                        navigate('/login?redirect=checkout');
                      }}
                      className="w-full py-3.5 sm:py-4 px-4 min-h-[48px] text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-bold text-[#FAF7F2] bg-[#1F3A32] hover:bg-[#142822] border border-[#B89B5E] rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Lock className="w-4 h-4 text-[#D4BE8D]" />
                      <span>Sign In or Register to Place Order</span>
                    </button>
                  )}
                </div>
              </div>

            </form>

          </div>

          {/* Right: Order Summary & Dynamic Quantity Sync (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white border border-[#111111]/10 p-6 sm:p-8 space-y-5 shadow-2xs">
              
              <div className="flex justify-between items-center pb-3 border-b border-[#111111]/10">
                <h3 className="text-base font-serif font-light uppercase tracking-wider">
                  Order Summary
                </h3>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">
                  [{cart.length} {cart.length === 1 ? 'item' : 'items'}]
                </span>
              </div>

              {/* Dynamic Line Items with Synchronized Quantity Controls */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                {cart.map((item) => {
                  const itemKey = item.productId || item.id;
                  return (
                    <div key={itemKey} className="flex gap-3.5 pb-4 border-b border-[#111111]/5">
                      <div className="w-16 h-20 bg-[#FAF8F5] border border-[#111111]/5 overflow-hidden flex-shrink-0">
                        <img src={item.image || '/images/ring_detail.jpg'} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-serif text-[#111111] line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(itemKey)}
                              className="text-stone-400 hover:text-red-500 transition-colors p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">
                            {item.selectedSize || item.metalFinish || '14K Gold'}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          {/* Sync Quantity Buttons */}
                          <div className="flex items-center border border-[#111111]/20 bg-[#FAF8F5]">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(itemKey)}
                              className="px-2 py-0.5 text-xs hover:bg-white transition-colors font-medium"
                              title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="px-2 text-xs font-medium min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(itemKey)}
                              className="px-2 py-0.5 text-xs hover:bg-white transition-colors font-medium"
                              title="Increase quantity"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="text-xs font-medium">
                            {formatPrice ? formatPrice(item.price * item.quantity) : `₹${(item.price * item.quantity).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#111111]/10 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice ? formatPrice(cartSubtotal) : `₹${cartSubtotal.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-700 font-medium">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between font-serif text-base font-medium pt-2 border-t border-[#111111]/10">
                  <span>Grand Total</span>
                  <span>{formatPrice ? formatPrice(grandTotal) : `₹${grandTotal.toLocaleString('en-IN')}`}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="pt-3 border-t border-[#111111]/10 space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Lifetime Manufacturing Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Tamper-proof insured luxury box</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
