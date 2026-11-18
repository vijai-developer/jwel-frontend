import React from 'react';

export const EditorialCraftCare = () => {
  return (
    <section id="craft" className="py-16 sm:py-32 px-4 sm:px-12 bg-[#FAF6EE] text-[#1E1E1E] border-t border-[#B89B5E]/20 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <span className="text-xs font-serif italic text-[#B89B5E] tracking-widest text-lg">
            05
          </span>
          <div className="h-px w-8 bg-[#B89B5E]/40" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
            Artisanal Standards
          </span>
        </div>

        {/* Calm Image-led Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Large Lifestyle Photo Close-up on Texture (Cols 1-7) - Medium on phone */}
          <div className="lg:col-span-7">
            <div className="editorial-zoom-container aspect-[4/3] sm:aspect-[16/10] max-h-[260px] sm:max-h-none bg-[#E9E1D3] shadow-xs">
              <img
                src="/images/atelier_craft.jpg"
                alt="Karigar hand-finishing 24K micro gold jewellery texture"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2.5 font-light text-center sm:text-left">
              Master Goldsmith Workshop • Micro-Prong Stone Setting
            </p>
          </div>

          {/* Three Short Lines of Text with Thin Dividers - NO ICONS (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-[0.02em] text-[#1F3A32] mb-6 sm:mb-10">
              The Sushma <span className="font-serif italic text-[#B89B5E]">Guarantee</span>
            </h2>

            <div className="flex flex-col">
              
              {/* Pillar 1 */}
              <div className="py-6 border-t border-[#B89B5E]/30">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1F3A32] font-normal mb-2 tracking-[0.02em]">
                  Anti-Tarnish Finish
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                  Every creation is fortified with a nano-molecular clear lacquer that shields the 24K gold coating against environmental oxidation and moisture.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="py-6 border-t border-[#B89B5E]/30">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1F3A32] font-normal mb-2 tracking-[0.02em]">
                  Skin-Friendly Materials
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                  Crafted over pure copper and hypoallergenic jewelry alloys. Certified 100% nickel-free and lead-free for sensitive skin comfort.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="py-6 border-t border-b border-[#B89B5E]/30">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1F3A32] font-normal mb-2 tracking-[0.02em]">
                  Hand-Finished Detailing
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                  Individually inspected and polished by generational artisans to guarantee mirror-like gold reflections and seamless stone prong alignment.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

