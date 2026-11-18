import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop, useCart } from '../context/CartContext';
import { ShieldCheck, Lock, Eye, EyeOff, X, Crown, KeyRound, AlertCircle } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = useAuth();
  const { setCurrentView } = useShop();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    const success = await loginAdmin(passcode);
    if (success) {
      setPasscode('');
      setCurrentView('admin-overview');
      navigate('/admin/overview');
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPasscode('');
    setError(false);
    setIsAdminLoginOpen(false);
    // If attempting to view admin path without authentication, redirect away to storefront
    if (window.location.pathname.startsWith('/admin')) {
      setCurrentView('home');
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md bg-[#1C1917] text-[#FAF7F2] border border-[#B8935F]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8935F] via-[#F3E5AB] to-[#B8935F]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white hover:bg-stone-800/60 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2A2421] border border-[#B8935F]/30 mb-3 shadow-inner">
            <Crown className="w-7 h-7 text-[#B8935F]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#FAF7F2] tracking-wide">
            Admin Access Verification
          </h3>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8935F] mt-1 font-medium">
            Sushma Jewels &bull; Management Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#B8935F]" />
              <span>Enter Security Passcode</span>
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setError(false); }}
                placeholder="Passcode..."
                autoFocus
                className={`w-full pl-10 pr-10 py-3 bg-[#262220] border ${
                  error ? 'border-red-500 text-red-200' : 'border-stone-700 focus:border-[#B8935F]'
                } rounded-xl text-sm text-[#FAF7F2] placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#B8935F] transition-all font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-white"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-red-400 text-xs animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Invalid passcode. Please try again.</span>
              </div>
            )}
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#B8935F] to-[#D4AF37] hover:from-[#A27E4B] hover:to-[#B8935F] text-[#1C1917] font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-[#B8935F]/20 flex items-center justify-center gap-2 group mt-2 cursor-pointer"
          >
            <span>Unlock Admin Portal</span>
            <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        <p className="text-[10px] text-stone-500 text-center mt-6 tracking-wide">
          Authorized personnel only. Sessions auto-persist on this device.
        </p>

      </div>
    </div>
  );
};
