import React from 'react';

export const EditorialCollage = () => {
  return (
    <section id="story" className="py-16 sm:py-32 px-4 sm:px-12 bg-[#F8F3EA] text-[#1E1E1E] overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Number & Category Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <span className="text-xs font-serif italic text-[#B89B5E] tracking-widest text-lg">
            01
          </span>
          <div className="h-px w-8 bg-[#B89B5E]/40" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
            Our Story & Atelier
          </span>
        </div>

        {/* Asymmetric Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Medium Image on mobile, tall on desktop */}
          <div className="lg:col-span-6 relative">
            <div className="editorial-zoom-container aspect-[4/3] sm:aspect-[3/4] max-h-[300px] sm:max-h-none max-w-sm sm:max-w-lg mx-auto lg:mx-0 shadow-xs">
              <img
                src="/images/tennis_necklace.jpg"
                alt="Sushma Jewels Fine Necklace Silhouette"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            {/* Small subtle caption under left photo */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2.5 font-light text-center sm:text-left">
              Fig. 1.0 — Graduated Solitaire Drop Atelier Piece
            </p>
          </div>

          {/* Right Column: Text narrative + 2 staggered stacked images (Cols 7-12) */}
          <div className="lg:col-span-6 flex flex-col gap-8 sm:gap-10">
            
            {/* Narrative text block */}
            <div className="max-w-md">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.18] tracking-[0.02em] mb-4 sm:mb-6 text-[#1F3A32]">
                Crafted for Moments That <span className="font-serif italic text-[#B89B5E]">Outlast</span> Time
              </h2>
              <p className="text-xs sm:text-base text-[#1E1E1E]/80 leading-relaxed font-light mb-4">
                At Sushma Jewels, we re-imagine royal heirloom jewellery for the contemporary woman. Handcrafted by master karigars with authentic 24K micro-gold plating and optically flawless stones, every creation honors the majesty of Indian heritage with featherlight grace.
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#B89B5E] font-medium">
                Hyderabad • Mumbai • Jaipur
              </p>
            </div>

            {/* Two Smaller Images Stacked at Different Heights with Overlap & Gold Offset Outline */}
            <div className="relative pt-2 sm:pt-8 flex items-start gap-4 sm:gap-8 overflow-hidden sm:overflow-visible">
              
              {/* Image 1 with Offset Gold Outline */}
              <div className="relative w-1/2">
                {/* Thin gold offset hairline frame behind image */}
                <div className="absolute inset-0 sm:-inset-2.5 border border-[#B89B5E]/40 sm:translate-x-1.5 sm:translate-y-1.5 pointer-events-none" />
                <div className="editorial-zoom-container aspect-[4/5] relative z-10 bg-[#E9E1D3]">
                  <img
                    src="/images/atelier_craft.jpg"
                    alt="Karigar hand-setting gemstones"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-2">
                  Hand-Setting
                </span>
              </div>

              {/* Image 2 (shifted lower down for staggered asymmetry) */}
              <div className="w-1/2 mt-6 sm:mt-16">
                <div className="editorial-zoom-container aspect-square bg-[#E9E1D3]">
                  <img
                    src="/images/ring_detail.jpg"
                    alt="Bezel eternity detailing"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-2">
                  Micro-Prong Precision
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

