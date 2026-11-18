import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/CartContext';

export const EditorialOccasions = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useShop();

  const occasions = [
    {
      id: 'bridal',
      title: 'Bridal & Heritage',
      tag: 'Grand Occasions',
      subtitle: 'Imperial Kundan chokers, temple harams & bridal sets',
      image: '/images/kundan_cz.png',
      category: 'Collections'
    },
    {
      id: 'festive',
      title: 'Festive Celebrations',
      tag: 'Festivals & Weddings',
      subtitle: '24K micro-gold peacocks, emerald drops & antique motifs',
      image: '/images/temple_haram.png',
      category: 'Necklaces'
    },
    {
      id: 'everyday',
      title: 'Everyday Radiance',
      tag: 'Signature Daily',
      subtitle: 'Featherlight mangalsutras, huggie drops & bezel tennis bands',
      image: '/images/tennis_bracelet.jpg',
      category: 'Bracelets'
    }
  ];

  const handleOccasionClick = (category) => {
    setSelectedCategory(category);
    navigate('/catalog');
  };

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-[#F8F3EA] border-t border-[#B89B5E]/20 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-16 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs font-serif italic text-[#B89B5E] tracking-widest text-lg">
                04
              </span>
              <div className="h-px w-8 bg-[#B89B5E]/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
                Style by Occasion
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-[0.02em] text-[#1F3A32]">
              Moments of <span className="font-serif italic text-[#B89B5E]">Elegance</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xs">
            From regal bridal ceremonies to effortless everyday polish.
          </p>
        </div>

        {/* Accordion Panels on Desktop / Medium Cards on Mobile */}
        <div className="editorial-accordion-parent flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0 lg:min-h-[580px]">
          {occasions.map((occ) => (
            <div
              key={occ.id}
              onClick={() => handleOccasionClick(occ.category)}
              className="editorial-accordion-item relative overflow-hidden cursor-pointer bg-[#142822] shadow-xs group h-[250px] sm:h-[340px] lg:h-auto w-full"
            >
              {/* Background Photography with Slow Zoom */}
              <img
                src={occ.image}
                alt={occ.title}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Scrim for Editorial Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#142822] via-[#142822]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Text Layer in lower portion */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4BE8D] font-medium mb-1.5 sm:mb-2">
                  {occ.tag}
                </span>

                <h3 className="font-serif text-2xl sm:text-4xl text-[#F8F3EA] font-normal leading-tight tracking-[0.02em] mb-1.5 sm:mb-2">
                  {occ.title}
                </h3>

                <p className="text-xs text-[#F8F3EA]/75 font-light line-clamp-2 max-w-md mb-3 sm:mb-4">
                  {occ.subtitle}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="editorial-link-underline text-[11px] uppercase tracking-[0.2em] font-medium text-[#F8F3EA] group-hover:text-[#B89B5E]">
                    <span>Explore Lookbook</span>
                    <span>→</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

