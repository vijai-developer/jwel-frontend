import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import { 
  Crown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  UserCheck,
  User,
  Phone,
  Sparkles
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const { setUser, setToken, setIsAdminAuthenticated } = useAuth();
  const { setCurrentView, showToast } = useCart();

  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode && paramMode.toLowerCase() === 'register') {
      setMode('REGISTER');
    }
  }, [searchParams]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (isLoading) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      let response;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (mode === 'REGISTER') {
        if (!name.trim() || name.trim().length < 2) {
          throw new Error('Please enter your full name (at least 2 characters).');
        }
        if (!email.trim() || !emailRegex.test(email.trim())) {
          throw new Error('Please enter a valid email address (e.g. name@domain.com).');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 13)) {
          throw new Error('Please enter a valid 10-digit mobile phone number.');
        }

        response = await authService.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          phone: phone.trim()
        });

        showToast(`✨ Welcome to Sushma Jewels, ${response.user?.name || 'Customer'}! Account created.`);
      } else {
        if (!email.trim() || (!emailRegex.test(email.trim()) && !email.trim().toLowerCase().includes('admin'))) {
          throw new Error('Please enter a valid email address.');
        }
        if (!password.trim()) {
          throw new Error('Please enter your account password.');
        }

        response = await authService.login(email.trim().toLowerCase(), password);
        showToast(`✨ Welcome back, ${response.user?.name || 'User'}!`);
      }

      if (!response || !response.user) {
        throw new Error('Authentication response is missing user data.');
      }

      const loggedInUser = response.user;

      if (setUser) setUser(loggedInUser);
      if (setToken) setToken(response.token);
      if (setIsAdminAuthenticated) setIsAdminAuthenticated(loggedInUser.role === 'ADMIN');

      if (loggedInUser.role === 'ADMIN') {
        setCurrentView('admin-overview');
        navigate('/admin/overview');
      } else if (redirectTo === 'checkout') {
        setCurrentView('checkout');
        navigate('/checkout');
      } else {
        setCurrentView('account');
        navigate('/account');
      }

    } catch (err) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCustomerCredentials = () => {
    setMode('LOGIN');
    setErrorMessage('');
    setEmail('customer@example.com');
    setPassword('user123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FDFBF7] text-[#2C2E2B] font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8DFD1] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
        
        {/* Subtle Luxury Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF0E4] to-[#F5E6D3] border border-[#E8DFD1] text-[#8C6D31] flex items-center justify-center mx-auto shadow-2xs">
            <Crown className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h1 className="text-2xl font-extrabold font-royal gold-text-gradient">
            {mode === 'LOGIN' ? 'Sushma Jewels Vault' : 'Create Heirloom Account'}
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {mode === 'LOGIN' 
              ? 'Sign in to access your luxury jewellery vault, orders, and privileges.' 
              : 'Register your profile in our atelier registry to unlock bespoke tracking and service.'}
          </p>
        </div>

        {/* Order Placement Context Notice */}
        {redirectTo === 'checkout' && (
          <div className="bg-[#FAF0E4] border border-[#C5A059]/40 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-[#8C6D31] shadow-2xs">
            <Lock className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="font-medium">
              Please sign in or create an account to securely place and guarantee your order.
            </span>
          </div>
        )}

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex bg-[#FAF6F0] p-1 rounded-2xl border border-[#E8DFD1] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
              mode === 'LOGIN'
                ? 'bg-white text-[#8C6D31] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
              mode === 'REGISTER'
                ? 'bg-white text-[#8C6D31] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 animate-fade-in shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Name Field (Register Mode Only) */}
          {mode === 'REGISTER' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-bold text-[#8C6D31] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Sushma Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#FAF6F0] focus:bg-white border border-[#E8DFD1] focus:border-[#C5A059] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2E2B] placeholder-gray-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8C6D31] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#FAF6F0] focus:bg-white border border-[#E8DFD1] focus:border-[#C5A059] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2E2B] placeholder-gray-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone Field (Register Mode Only) */}
          {mode === 'REGISTER' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-bold text-[#8C6D31] uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#FAF6F0] focus:bg-white border border-[#E8DFD1] focus:border-[#C5A059] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2E2B] placeholder-gray-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#8C6D31] uppercase tracking-wider">
                Password
              </label>
              {mode === 'LOGIN' && (
                <button
                  type="button"
                  onClick={() => showToast('Demo Mode: Click quick credentials below')}
                  className="text-[10px] text-gray-400 hover:text-[#8C6D31] transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'REGISTER' ? 'Minimum 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#FAF6F0] focus:bg-white border border-[#E8DFD1] focus:border-[#C5A059] rounded-2xl pl-10 pr-10 py-3 text-xs text-[#2C2E2B] placeholder-gray-400 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#8C6D31] hover:from-[#B8924B] hover:to-[#725725] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{mode === 'REGISTER' ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <>
                <span>{mode === 'REGISTER' ? 'Register Account' : 'Sign In to Vault'}</span>
                {mode === 'REGISTER' ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Client Demo Helper (Login Mode) */}
        {mode === 'LOGIN' && (
          <div className="pt-3 border-t border-[#E8DFD1] space-y-2">
            <button
              type="button"
              onClick={fillCustomerCredentials}
              className="w-full p-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F3EFE8] border border-[#E8DFD1] text-[11px] font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Client Demo Credentials (customer@example.com)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage('');
                setEmail('admin@sushma.com');
                setPassword('admin123');
              }}
              className="w-full p-2.5 rounded-xl bg-[#FAF0E4] hover:bg-[#F5E6D3] border border-[#E8DFD1] text-[11px] font-bold text-[#8C6D31] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Fill Admin Credentials (admin@sushma.com)</span>
            </button>
          </div>
        )}

        {/* Back to Home Storefront */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="text-xs text-gray-500 hover:text-[#8C6D31] font-semibold transition-colors cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
