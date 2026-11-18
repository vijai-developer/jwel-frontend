import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PROMO_CODES } from '../data/initialProducts';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight
} from 'lucide-react';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    increaseQuantity,
    decreaseQuantity,
    removeFromCart, 
    cartSubtotal,
    setIsCheckoutOpen,
    setCurrentView,
    setSelectedCategory,
    formatPrice
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  if (!isCartOpen) return null;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount) {
      discountAmount = cartSubtotal * appliedPromo.discount;
    } else if (appliedPromo.flatDiscount) {
      discountAmount = appliedPromo.flatDiscount;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#111111]/10 shadow-2xl flex flex-col text-[#111111]">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#111111]/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif uppercase tracking-[0.2em] font-light">Your Cart</h2>
              <span className="text-[10px] uppercase tracking-widest text-stone-500">[{cart.length} {cart.length === 1 ? 'item' : 'items'}]</span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 stroke-[1]" />
                <p className="text-sm font-serif text-stone-600 font-light">Your cart is currently empty.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Items');
                    setCurrentView('catalog');
                    setIsCartOpen(false);
                  }}
                  className="heirest-btn-dark px-6 py-2.5 text-[10px]"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemKey = item.productId || item.id;
                return (
                  <div key={itemKey} className="flex gap-4 pb-6 border-b border-[#111111]/5">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 bg-[#F4EFEA] border border-[#111111]/5 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || '/images/ring_detail.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Item Info & Controls */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-serif font-normal text-[#111111] line-clamp-1">
                            {item.name}
                          </h4>
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

                      <div className="flex justify-between items-center pt-2">
                        {/* Instant Quantity Controller: [-] [qty] [+] */}
                        <div className="flex items-center border border-[#111111]/20 bg-white">
                          <button
                            onClick={() => decreaseQuantity(itemKey)}
                            className="px-2.5 py-1 text-xs hover:bg-[#F4EFEA] transition-colors font-medium"
                            title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(itemKey)}
                            className="px-2.5 py-1 text-xs hover:bg-[#F4EFEA] transition-colors font-medium"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Total */}
                        <span className="text-xs font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#111111]/10 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
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

              {/* Subtotal and Total Summary */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between font-serif text-sm font-medium pt-1 border-t border-[#111111]/5">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                <p className="text-[10px] text-stone-400 pt-0.5">
                  Taxes and complimentary insured shipping calculated at checkout.
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (!user) {
                    navigate('/login?redirect=checkout');
                  } else {
                    setCurrentView('checkout');
                    navigate('/checkout');
                  }
                }}
                className="w-full heirest-btn-dark py-4 text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[48px] active:scale-98"
              >
                <span>{user ? 'Proceed to Checkout' : 'Sign In to Checkout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-[10px] text-stone-500 uppercase tracking-widest">
                Lifetime Manufacturing Warranty Included
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
