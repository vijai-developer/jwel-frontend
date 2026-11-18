import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

export const EditorialNavbar = () => {
  const navigate = useNavigate();
  const {
    cartItemCount,
    setIsCartOpen,
    setSelectedCategory,
    searchTerm,
    setSearchTerm
  } = useShop();

  const { favoritesCount } = useFavorites();
  const { user, isAdminAuthenticated, setIsAdminLoginOpen } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryNav = (cat) => {
    setSelectedCategory(cat);
    navigate('/catalog');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/catalog');
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F8F3EA]/95 backdrop-blur-md border-b border-[#B89B5E]/30 shadow-xs py-3.5 text-[#1E1E1E]'
          : 'bg-transparent text-[#F8F3EA] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
            <button
              onClick={() => handleCategoryNav('All Items')}
              className="transition-colors hover:text-[#B89B5E]"
            >
              Collections
            </button>
            <button
              onClick={() => handleCategoryNav('Necklaces')}
              className="transition-colors hover:text-[#B89B5E]"
            >
              Necklaces
            </button>
            <button
              onClick={() => handleCategoryNav('Earrings')}
              className="transition-colors hover:text-[#B89B5E]"
            >
              Earrings
            </button>
          </nav>

          {/* Center Brand Identity */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block group"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.14em] font-normal uppercase block transition-transform duration-300 group-hover:scale-[1.01]">
                Sushma Jewels
              </span>
              <span className="text-[9px] uppercase tracking-[0.32em] text-[#B89B5E] block -mt-1 font-medium">
                Haute Atelier
              </span>
            </a>
          </div>

          {/* Right Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
            <button
              onClick={() => handleCategoryNav('Bracelets')}
              className="transition-colors hover:text-[#B89B5E]"
            >
              Bangles
            </button>
            <a
              href="#story"
              className="transition-colors hover:text-[#B89B5E]"
            >
              About
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-[#B89B5E]"
            >
              Contact
            </a>
          </nav>

          {/* Far Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-[#B89B5E] transition-colors"
              aria-label="Search catalogue"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigate('/favorites')}
              className="p-1 hover:text-[#B89B5E] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#B89B5E] text-[#F8F3EA] text-[9px] rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Account / Auth Trigger */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  navigate('/admin');
                } else if (user) {
                  navigate('/account');
                } else {
                  navigate('/login');
                }
              }}
              className="p-1 hover:text-[#B89B5E] transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Cart Trigger with badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:text-[#B89B5E] transition-colors relative flex items-center gap-1.5"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="text-[10px] tracking-widest font-semibold text-[#B89B5E]">
                  ({cartItemCount})
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="mt-3 pt-3 border-t border-[#B89B5E]/20 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search necklaces, jhumkas, bridal kundan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b border-[#B89B5E] py-2 pl-2 pr-10 text-sm tracking-wide focus:outline-hidden placeholder:text-gray-400 font-light"
              />
              <button
                type="submit"
                className="absolute right-0 p-2 text-[#B89B5E] hover:opacity-80"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F3EA] text-[#1E1E1E] border-b border-[#B89B5E]/30 px-6 py-8 shadow-xl animate-fadeIn">
          <nav className="flex flex-col gap-5 text-xs uppercase tracking-[0.25em] font-medium">
            <button
              onClick={() => handleCategoryNav('All Items')}
              className="text-left py-1 hover:text-[#B89B5E]"
            >
              All Collections
            </button>
            <button
              onClick={() => handleCategoryNav('Necklaces')}
              className="text-left py-1 hover:text-[#B89B5E]"
            >
              Necklaces & Harams
            </button>
            <button
              onClick={() => handleCategoryNav('Earrings')}
              className="text-left py-1 hover:text-[#B89B5E]"
            >
              Earrings & Jhumkas
            </button>
            <button
              onClick={() => handleCategoryNav('Bracelets')}
              className="text-left py-1 hover:text-[#B89B5E]"
            >
              Bangles & Kadas
            </button>
            <button
              onClick={() => handleCategoryNav('Rings')}
              className="text-left py-1 hover:text-[#B89B5E]"
            >
              Rings
            </button>
            <div className="h-px bg-[#B89B5E]/20 my-2" />
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-1 text-gray-600 hover:text-[#1E1E1E]"
            >
              Our Story
            </a>
            <a
              href="#craft"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-1 text-gray-600 hover:text-[#1E1E1E]"
            >
              Craft & Care
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-1 text-gray-600 hover:text-[#1E1E1E]"
            >
              Contact & Concierge
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

