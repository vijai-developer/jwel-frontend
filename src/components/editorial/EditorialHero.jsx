import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/CartContext';

export const EditorialHero = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useShop();

  const handleDiscover = (e) => {
    e.preventDefault();
    setSelectedCategory('All Items');
    navigate('/catalog');
  };

  return (
    <section className="relative w-full h-[56vh] sm:h-screen min-h-[380px] sm:min-h-[640px] max-h-[500px] sm:max-h-[1080px] overflow-hidden bg-[#142822]">
      {/* Full-bleed Model/Jewellery Background Image */}
      <img
        src="/images/heirest_hero.jpg"
        alt="Sushma Jewels Festive Lookbook"
        className="absolute inset-0 w-full h-full object-cover object-top scale-100 transition-transform duration-1000 ease-out"
        fetchPriority="high"
      />

      {/* Editorial Gradient Overlay: dark bottle green at bottom, soft subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A32] via-[#1F3A32]/40 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#142822]/60 via-transparent to-transparent" />

      {/* Content Placed at Bottom-Left */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-12 pb-10 sm:pb-24 flex flex-col justify-end">
        <div className="max-w-xl">
          {/* Tiny Uppercase Label */}
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.3em] font-medium text-[#D4BE8D] mb-2 sm:mb-3">
            The Festive Lookbook • Volume IV
          </p>

          {/* Large Serif Headline with one word in italic gold */}
          <h1 className="font-serif text-3xl sm:text-6xl lg:text-7xl text-[#F8F3EA] leading-[1.12] sm:leading-[1.08] font-normal tracking-[0.02em] mb-4 sm:mb-6">
            Adorned in <span className="font-serif italic font-light text-[#B89B5E]">Tradition</span>
          </h1>

          {/* Single Understated Text Link with Thin Underline (No Button Box) */}
          <div>
            <a
              href="/catalog"
              onClick={handleDiscover}
              className="editorial-link-underline text-[#F8F3EA] hover:text-[#B89B5E] text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.22em] uppercase font-medium"
            >
              <span>Discover the Collection</span>
              <span className="text-base font-light">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Small 'Scroll' Indicator with thin vertical line at bottom centre */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none opacity-80 z-10">
        <span className="text-[9px] uppercase tracking-[0.32em] text-[#F8F3EA]/70 font-medium">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#B89B5E] to-transparent animate-pulse" />
      </div>
    </section>
  );
};

