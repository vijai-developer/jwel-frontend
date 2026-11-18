import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop, useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PROMO_CODES } from '../data/initialProducts';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Lock
} from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    increaseQuantity,
    decreaseQuantity,
    removeFromCart, 
    clearCart,
    cartSubtotal,
    setCurrentView,
    setSelectedCategory,
    showToast,
    formatPrice
  } = useShop();

  // Coupon / Promo state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Compute discount
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discount) {
      return Math.round(cartSubtotal * appliedPromo.discount);
    }
    if (appliedPromo.flatDiscount) {
      return appliedPromo.flatDiscount;
    }
    return 0;
  }, [appliedPromo, cartSubtotal]);

  const finalPayable = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = (e) => {
    if (e) e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      showToast(`Coupon "${code}" applied.`);
      setPromoCodeInput('');
    } else {
      showToast('Invalid promo code.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md space-y-5">
          <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-[1]" />
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-light text-[#111111]">Your Cart is Empty</h2>
            <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
              You have no items in your shopping bag. Explore our collection to find your next heirloom.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setCurrentView('catalog');
            }}
            className="heirest-btn-dark px-8 py-3.5 text-xs tracking-[0.2em] inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#111111] pb-24">
      
      {/* Header */}
      <div className="border-b border-[#111111]/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium block">
              Shopping Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-[#111111] mt-0.5">
              Review Your Cart
            </h1>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setCurrentView('catalog');
            }}
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-[#111111] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Main Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Item Table Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#111111]/10 p-6 sm:p-8 space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-[#111111]/10 text-xs uppercase tracking-widest text-stone-500">
                <span>Selected Pieces ({cart.length})</span>
                <button onClick={clearCart} className="hover:text-red-500 transition-colors">Clear Bag</button>
              </div>

              <div className="space-y-6">
                {cart.map((item) => {
                  const itemKey = item.productId || item.id;
                  return (
                    <div key={itemKey} className="flex gap-4 pb-6 border-b border-[#111111]/5 last:border-0 last:pb-0">
                      <div className="w-20 h-24 bg-[#FAF8F5] border border-[#111111]/5 overflow-hidden flex-shrink-0">
                        <img src={item.image || '/images/ring_detail.jpg'} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-serif font-normal text-[#111111]">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(itemKey)}
                              className="text-stone-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">
                            {item.selectedSize || item.metalFinish || '14K Gold'}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3">
                          {/* Quantity Controls: [-] [qty] [+] */}
                          <div className="flex items-center border border-[#111111]/20 bg-[#FAF8F5]">
                            <button
                              onClick={() => decreaseQuantity(itemKey)}
                              className="px-2.5 py-1 text-xs hover:bg-white transition-colors font-medium"
                              title={item.quantity === 1 ? "Remove" : "Decrease"}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(itemKey)}
                              className="px-2.5 py-1 text-xs hover:bg-white transition-colors font-medium"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-stone-400 block">
                                ({formatPrice(item.price)} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Order Summary Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-[#111111]/10 p-6 sm:p-8 space-y-5">
              <h3 className="text-base font-serif font-light uppercase tracking-wider pb-3 border-b border-[#111111]/10">
                Order Summary
              </h3>

              {/* Promo form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-[10px] uppercase tracking-widest flex-1 focus:outline-none focus:border-[#111111]"
                />
                <button type="submit" className="heirest-btn-outline px-4 text-[10px]">
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="text-[10px] text-emerald-700 flex justify-between">
                  <span>Applied: {appliedPromo.code}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Summary lines */}
              <div className="space-y-2 pt-2 border-t border-[#111111]/10 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotional Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-700 font-medium">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-medium pt-3 border-t border-[#111111]/10">
                  <span>Payable Total</span>
                  <span>{formatPrice(finalPayable)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  if (!user) {
                    showToast('🔒 Please sign in or register to complete your order.');
                    navigate('/login?redirect=checkout');
                  } else {
                    setCurrentView('checkout');
                    navigate('/checkout');
                  }
                }}
                className="w-full heirest-btn-dark py-4 text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>{user ? 'Proceed to Checkout' : 'Sign In to Checkout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-3 border-t border-[#111111]/10 space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Lifetime Manufacturing Warranty Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Complimentary Insured Worldwide Shipping</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
