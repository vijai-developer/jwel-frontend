import React from 'react';

export const EditorialStatementBanner = () => {
  return (
    <section className="relative w-full h-[280px] sm:h-[480px] lg:h-[560px] overflow-hidden bg-[#1F3A32]">
      {/* Cinematic Wide Image */}
      <img
        src="/images/hero_banner.png"
        alt="Sushma Jewels Statement Lookbook Banner"
        className="absolute inset-0 w-full h-full object-cover object-center scale-100"
        loading="lazy"
      />

      {/* Deep bottle green overlay */}
      <div className="absolute inset-0 bg-[#1F3A32]/75 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#142822]/90 via-transparent to-[#142822]/60" />

      {/* Thin Gold Frame Inset From Edges */}
      <div className="editorial-inset-frame" />

      {/* Centered Quote-Style Text */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 sm:px-16 max-w-4xl mx-auto">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#D4BE8D] font-medium mb-3 sm:mb-6">
          The Philosophy
        </span>

        <h2 className="font-serif text-2xl sm:text-5xl lg:text-6xl text-[#F8F3EA] font-normal leading-tight tracking-[0.02em] max-w-2xl">
          “Jewellery that tells your <span className="font-serif italic text-[#B89B5E]">story</span> with every glimmer.”
        </h2>

        <div className="w-12 h-px bg-[#B89B5E]/60 mt-4 sm:mt-8 mb-2 sm:mb-4" />

        <p className="text-[11px] sm:text-sm text-[#F8F3EA]/80 font-light tracking-widest uppercase">
          Handcrafted in India • Worn Worldwide
        </p>
      </div>
    </section>
  );
};

