import React, { useState, useEffect } from 'react';
import { useShop, useCart } from '../context/CartContext';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Lock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    placeOrder, 
    showToast 
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

  const [customer, setCustomer] = useState({
    name: 'Sushma Client',
    phone: '9840012345',
    email: 'client@atelier.com',
    address: '14 Heirloom Boulevard, Fine Arts Quarter',
    pincode: '600017',
    city: 'Chennai',
    state: 'Tamil Nadu'
  });

  const [paymentMode, setPaymentMode] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const finalTotal = cartSubtotal;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      showToast('Please complete shipping fields.');
      return;
    }
    setStep(2);
  };

  const handleFinalPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      placeOrder({
        customer,
        items: cart,
        totalAmount: cartSubtotal,
        discountAmount: 0,
        finalAmount: finalTotal,
        paymentMethod: paymentMode === 'UPI' ? 'Instant UPI / QR' : paymentMode === 'CARD' ? 'Encrypted Card' : 'Netbanking',
        paymentId: `PAY-${Date.now().toString().slice(-8)}`
      });
      setStep(1);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#111111]/15 max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 text-[#111111]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#111111]/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium">
              Step {step} of 2
            </span>
            <h2 className="text-lg font-serif font-light uppercase tracking-widest">
              {step === 1 ? 'Insured Delivery Address' : 'Secure Payment Method'}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 text-stone-500 hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">Email for Tracking & Certificate</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">Street Address</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-medium text-stone-600">State</label>
                  <input
                    type="text"
                    required
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full bg-white border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#111111]/10">
                <div className="text-xs">
                  <span className="text-stone-500">Total: </span>
                  <span className="font-medium font-serif text-sm">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  className="heirest-btn-dark px-6 py-3 text-xs tracking-[0.2em] flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'CARD', label: 'Credit / Debit', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Netbanking', icon: Lock }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setPaymentMode(mode.id)}
                    className={`p-4 border text-center space-y-2 transition-all ${
                      paymentMode === mode.id
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                    }`}
                  >
                    <mode.icon className="w-5 h-5 mx-auto" />
                    <span className="text-[10px] uppercase tracking-wider font-medium block">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Preview Box */}
              <div className="p-4 bg-white border border-[#111111]/10 text-center space-y-3">
                {paymentMode === 'UPI' && (
                  <div className="space-y-2">
                    <div className="w-32 h-32 mx-auto bg-[#FAF8F5] border border-[#111111]/20 flex items-center justify-center p-2">
                      <QrCode className="w-full h-full text-stone-800" />
                    </div>
                    <p className="text-[11px] text-stone-500">Scan using any UPI App (Google Pay / PhonePe / Paytm / BHIM)</p>
                  </div>
                )}

                {paymentMode === 'CARD' && (
                  <div className="space-y-2 text-left max-w-sm mx-auto">
                    <input type="text" placeholder="Card Number (4532 •••• •••• 8892)" className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-xs" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="MM/YY" className="bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-xs" />
                      <input type="text" placeholder="CVV" className="bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-xs" />
                    </div>
                  </div>
                )}

                {paymentMode === 'NETBANKING' && (
                  <div className="space-y-2 text-xs text-stone-600">
                    <p>Select your bank on next screen. All major Indian and International banks supported.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#111111]/10">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs uppercase tracking-widest text-stone-500 hover:text-[#111111] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleFinalPay}
                  disabled={isProcessing}
                  className="heirest-btn-dark px-8 py-3.5 text-xs tracking-[0.2em] flex items-center gap-2"
                >
                  <span>{isProcessing ? 'Confirming Order...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
