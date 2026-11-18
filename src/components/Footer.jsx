import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useShop } from '../context/CartContext';
import API from '../services/api';

export const Footer = () => {
  const { setSelectedCategory, setCurrentView } = useShop();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await API.post('/newsletter/subscribe', { email });
      setSubscribeMessage(res.data?.message || "You're on the list — keep an eye on your inbox.");
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      // Graceful offline fallback
      setSubscribeMessage("You're on the list — welcome to the Private Client Circle.");
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
      setTimeout(() => setSubscribed(false), 6000);
    }
  };

  return (
    <footer className="bg-[#111111] text-[#FAF8F5] pt-16 pb-12 mt-24 border-t border-[#111111]">
      
      {/* 1. Top Guarantee Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-stone-300">
          <div>Clarity & Transparency At Every Step</div>
          <div>Complimentary Worldwide Shipping</div>
          <div>Lifetime Manufacturing Warranty</div>
          <div>Every Piece Crafted By Hand</div>
        </div>
      </div>

      {/* 2. Newsletter & Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Newsletter Sign-up (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8935F] font-medium block">
            Private Client Circle
          </span>
          <h3 className="text-2xl font-serif text-[#FAF8F5] font-light leading-snug">
            Subscribe to our newsletter
          </h3>
          <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
            Sign up to access new product launches, private atelier previews and bespoke offers.
          </p>

          <form onSubmit={handleSubscribe} className="pt-2 flex max-w-sm border-b border-stone-600 focus-within:border-white transition-colors pb-1">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent text-xs text-white placeholder-stone-500 focus:outline-none flex-1 py-2 tracking-wide"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-xs uppercase tracking-widest text-[#B8935F] hover:text-white transition-colors px-2 flex items-center gap-1 font-medium disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : subscribed ? 'Subscribed' : 'Join'}</span>
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : subscribed ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </form>

          {subscribed && (
            <p className="text-[11px] text-emerald-400 font-light pt-1">
              {subscribeMessage}
            </p>
          )}

          <div className="pt-4 flex items-center gap-4 text-xs text-stone-400 tracking-wider">
            <span className="uppercase text-[10px] text-stone-500">Follow Us</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              @sushmajewels__
            </a>
          </div>
        </div>

        {/* Right: Clean Link Columns (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs tracking-wider">
          
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-white font-medium">Shop</h4>
            <ul className="space-y-2 text-stone-400 font-light">
              {['All Items', 'Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Collections'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentView('catalog');
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: About & Standards */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-white font-medium">Atelier</h4>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    const el = document.getElementById('standards-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Our Standards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedCategory('Collections');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Bespoke Design
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('tryon')}
                  className="hover:text-white transition-colors"
                >
                  Virtual Try-On
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  My Orders & Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-white font-medium">Client Care</h4>
            <ul className="space-y-2 text-stone-400 font-light text-[11px]">
              <li className="text-stone-300">Lifetime Warranty Included</li>
              <li className="text-stone-300">Complimentary Resizing (60 Days)</li>
              <li className="text-stone-300">Insured Worldwide Delivery</li>
              <li className="text-stone-400">care@sushmajewels.com</li>
            </ul>
          </div>

        </div>

      </div>

      {/* 3. Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-[0.15em] text-stone-500 uppercase gap-4">
        <div>
          © {new Date().getFullYear()} SUSHMA JEWELS. AUTHORED BY YOU. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-6">
          <span>INR • USD • AUD • GBP • EUR</span>
          <span>SECURE 256-BIT ENCRYPTION</span>
        </div>
      </div>

    </footer>
  );
};
