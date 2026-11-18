import React, { useState, useEffect } from 'react';
import { useShop } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Store,
  Camera,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  User,
  Crown
} from 'lucide-react';

export const Navbar = () => {
  const {
    cartItemCount,
    setIsCartOpen,
    currentView,
    setCurrentView,
    searchTerm,
    setSearchTerm,
    setSelectedCategory,
    currency,
    setCurrency
  } = useShop();

  const { favoritesCount } = useFavorites();
  const { user, isAdminAuthenticated, setIsAdminLoginOpen, logoutAdmin } = useAuth();

  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [isScrolled, setIsScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currencies = ['INR (₹)', 'USD ($)', 'AUD ($)', 'GBP (£)', 'EUR (€)', 'AED (د.إ)', 'CAD ($)'];

  const handleLogout = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Leave the protected admin area first
    setCurrentView('home');

    try {
      if (logoutAdmin) {
        await logoutAdmin();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isStoreView = !currentView.startsWith('admin');

  const navCategories = [
    { title: 'Rings', cat: 'Rings', sub: ['All Rings', 'Eternity Rings', '5-Stone Rings', 'Pinky Rings', 'Signet Rings'], img: '/images/ring_detail.jpg' },
    { title: 'Earrings', cat: 'Earrings', sub: ['All Earrings', 'Stud Earrings', 'Drop Huggies', 'Diamond Hoops'], img: '/images/earrings_detail.jpg' },
    { title: 'Bracelets', cat: 'Bracelets', sub: ['All Bracelets', 'Tennis Bracelets', 'Solitaire Chains', 'Bezel Cuffs'], img: '/images/tennis_bracelet.jpg' },
    { title: 'Necklaces', cat: 'Necklaces', sub: ['All Necklaces', 'Tennis Necklaces', 'Solitaire Pendants', 'Chokers & Harams'], img: '/images/tennis_necklace.jpg' },
    { title: 'Collections', cat: 'Collections', sub: ['Bespoke Atelier', 'Bezel Set', 'Georgian Edit', 'Classic Fine'], img: '/images/atelier_craft.jpg' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#111111]/10 transition-all duration-300 w-full">

      {/* 1. Minimal Announcement Bar */}
      <div className="bg-[#111111] text-[#FAF8F5] text-[10px] tracking-[0.2em] uppercase py-2 px-6 sm:px-10 lg:px-12 border-b border-[#111111] w-full">
        <div className="w-full flex justify-between items-center">

          {/* Ticker message */}
          <div className="mx-auto sm:mx-0 flex items-center gap-3">
            <span className="opacity-40">|</span>
            <span className="font-light">Lifetime Manufacturing Warranty</span>
            <span className="opacity-40">|</span>
            <span className="font-light">Complimentary Insured Shipping</span>
            <span className="opacity-40">|</span>
            <span className="hidden md:inline font-light">Optically Flawless Fine Stones</span>
          </div>

          {/* Admin link & logout right */}
          <div className="hidden sm:flex items-center gap-4 text-[#FAF8F5]/80 text-[10px]">
            {isStoreView ? (
              isAdminAuthenticated && (
                <button
                  onClick={() => setCurrentView('admin-overview')}
                  className="hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-widest text-[#B8935F]"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              )
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white uppercase tracking-widest flex items-center gap-1 text-[#B8935F]"
                >
                  <Store className="w-3 h-3" />
                  <span>Storefront</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 text-stone-400 uppercase tracking-widest flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className={`w-full px-6 sm:px-10 lg:px-12 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between w-full gap-6">

          {/* Left Corner: Brand Identity & Mobile Hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 text-[#111111] hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              className="flex items-center cursor-pointer select-none"
              onClick={() => setCurrentView('home')}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-brand font-normal tracking-[0.25em] uppercase text-[#111111] whitespace-nowrap">
                Sushma Jewels
              </h1>
            </div>
          </div>

          {/* Right Corner: Navigation Links + Utility Actions */}
          <div className="flex items-center gap-6 lg:gap-8 justify-end min-w-0">

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] font-medium text-[#111111]">
              <div
                className="relative py-2"
                onMouseEnter={() => setShopMenuOpen(true)}
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setSelectedCategory('All Items');
                    setCurrentView('catalog');
                  }}
                  className="flex items-center gap-1 hover:text-[#B8935F] transition-colors"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Visual Mega Dropdown aligned to right */}
                {shopMenuOpen && (
                  <div className="absolute top-full -right-24 w-[760px] bg-[#FAF8F5] border border-[#111111]/10 shadow-2xl p-8 rounded-none z-50 grid grid-cols-5 gap-6 animate-in fade-in duration-200">
                    {navCategories.map((c) => (
                      <div key={c.cat} className="space-y-3">
                        <div
                          onClick={() => {
                            setSelectedCategory(c.cat);
                            setCurrentView('catalog');
                            setShopMenuOpen(false);
                          }}
                          className="aspect-square overflow-hidden cursor-pointer bg-[#F4EFEA] border border-[#111111]/5 group"
                        >
                          <img
                            src={c.img}
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4
                          onClick={() => {
                            setSelectedCategory(c.cat);
                            setCurrentView('catalog');
                            setShopMenuOpen(false);
                          }}
                          className="text-[11px] font-serif font-bold text-[#111111] tracking-widest uppercase cursor-pointer hover:text-[#B8935F]"
                        >
                          {c.title}
                        </h4>
                        <ul className="space-y-1.5 text-[10px] text-stone-500 tracking-wider">
                          {c.sub.map((s, idx) => (
                            <li
                              key={idx}
                              onClick={() => {
                                setSelectedCategory(c.cat);
                                setCurrentView('catalog');
                                setShopMenuOpen(false);
                              }}
                              className="cursor-pointer hover:text-[#111111] transition-colors"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('Collections');
                  setCurrentView('catalog');
                }}
                className="hover:text-[#B8935F] transition-colors whitespace-nowrap"
              >
                Bespoke
              </button>

              <button
                onClick={() => {
                  setCurrentView('home');
                  const el = document.getElementById('standards-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#B8935F] transition-colors whitespace-nowrap"
              >
                Our Standards
              </button>

              <button
                onClick={() => setCurrentView('tryon')}
                className="hover:text-[#B8935F] transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Camera className="w-3.5 h-3.5 text-[#B8935F]" />
                <span>Virtual Mirror</span>
              </button>
            </nav>

            <div className="hidden lg:block w-[1px] h-4 bg-[#111111]/15" />

            {/* Utility Controls (Currency, Search, Favorites, Bag) */}
            <div className="flex items-center gap-4 sm:gap-5 text-[#111111] flex-shrink-0">

              {/* Currency Selector */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="text-[10px] tracking-widest uppercase font-medium hover:text-[#B8935F] flex items-center gap-1"
                >
                  <span>{currency}</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>

                {currencyDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-28 bg-[#FAF8F5] border border-[#111111]/10 shadow-lg py-1 z-50 text-[10px] tracking-widest">
                    {currencies.map((curr) => {
                      const code = curr.split(' ')[0];
                      return (
                        <button
                          key={curr}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-[#F4EFEA] transition-colors ${currency === code ? 'font-bold text-[#B8935F]' : ''}`}
                        >
                          {curr}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1 hover:text-[#B8935F] transition-colors"
                title="Search fine jewellery"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Favorites Navigation */}
              <button
                onClick={() => setCurrentView('favorites')}
                className={`relative p-1 transition-colors hidden sm:block ${currentView === 'favorites' ? 'text-[#B8935F]' : 'hover:text-[#B8935F]'
                  }`}
                title="Saved Pieces"
                aria-label="View Favorites"
              >
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-[#111111]' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#111111] text-[#E5C992] text-[8px] rounded-full flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Client Vault & Account */}
              <div className="relative">
                {currentUser ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`flex items-center gap-1.5 p-1 text-[11px] tracking-wider uppercase font-bold transition-colors cursor-pointer ${
                        currentView === 'account' ? 'text-[#B8935F]' : 'hover:text-[#B8935F]'
                      }`}
                      title="Atelier Vault & Orders"
                    >
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span className="hidden xl:inline max-w-[80px] truncate">{currentUser.name?.split(' ')[0] || 'Client'}</span>
                      <ChevronDown className="w-2.5 h-2.5 opacity-60 hidden xl:inline" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#FAF8F5] border border-[#111111]/15 shadow-2xl py-2 z-50 text-xs rounded-xl">
                        <div className="px-4 py-2 border-b border-stone-200">
                          <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentView('account');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#F4EFEA] transition-colors flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Crown className="w-3.5 h-3.5 text-[#B8935F]" />
                          <span>My Orders & Vault</span>
                        </button>
                        <div className="border-t border-stone-200 mt-1 pt-1">
                          <button
                            onClick={(e) => {
                              setUserDropdownOpen(false);
                              handleLogout(e);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setCurrentView('login')}
                    className="p-1 hover:text-[#B8935F] transition-colors flex items-center gap-1 text-[11px] tracking-wider uppercase font-bold cursor-pointer"
                    title="Sign In / Register"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden xl:inline">Sign In</span>
                  </button>
                )}
              </div>

              {/* Bag Counter [ 0 ] */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 text-[11px] tracking-widest font-medium hover:text-[#B8935F] transition-colors group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>[{cartItemCount || 0}]</span>
              </button>

            </div>

          </div>

        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="pt-4 pb-2 border-t border-[#111111]/10 mt-3 animate-in fade-in duration-200">
            <div className="max-w-xl mx-auto flex items-center gap-3 bg-white border border-[#111111]/20 px-4 py-2.5">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search rings, tennis bracelets, earrings, harams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentView('catalog');
                    setSearchOpen(false);
                  }
                }}
                className="w-full text-xs text-[#111111] focus:outline-none tracking-wide bg-transparent"
                autoFocus
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-stone-400 hover:text-[#111111]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentView('catalog');
                  setSearchOpen(false);
                }}
                className="heirest-btn-dark px-4 py-1.5 text-[10px]"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] border-r border-[#111111]/10 p-6 flex flex-col justify-between z-10 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#111111]/10">
                <div className="font-brand text-lg tracking-[0.2em] font-normal uppercase text-[#111111]">SUSHMA JEWELS</div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs uppercase tracking-[0.2em] font-medium">
                {navCategories.map((c) => (
                  <button
                    key={c.cat}
                    onClick={() => {
                      setSelectedCategory(c.cat);
                      setCurrentView('catalog');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 hover:text-[#B8935F] transition-colors"
                  >
                    {c.title}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentView('favorites');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-[#B8935F] transition-colors flex items-center justify-between"
                >
                  <span>Saved Pieces</span>
                  {favoritesCount > 0 && (
                    <span className="text-[10px] bg-[#111111] text-[#E5C992] px-2 py-0.5 rounded-full font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentView('tryon');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-[#B8935F]"
                >
                  ✦ Virtual Try-On Mirror
                </button>

                <button
                  onClick={() => {
                    setCurrentView(currentUser ? 'account' : 'login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-[#111111] hover:text-[#B8935F] transition-colors"
                >
                  {currentUser ? `✦ ${currentUser.name?.split(' ')[0]}'s Vault & Orders` : '✦ Client Vault / Sign In'}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#111111]/10 text-[10px] text-stone-500 tracking-widest uppercase space-y-2">
              <p>Lifetime Manufacturing Warranty</p>
              <p>Complimentary Insured Shipping</p>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
