import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/CartContext';

export const EditorialCollections = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useShop();

  const collections = [
    {
      id: 'necklaces',
      title: 'Necklaces & Harams',
      category: 'Necklaces',
      image: '/images/temple_haram.png',
      subtitle: 'Antique temple motifs & graduated solitaires',
      heightClass: 'h-[250px] sm:h-[440px] lg:h-[520px]'
    },
    {
      id: 'earrings',
      title: 'Earrings & Jhumkas',
      category: 'Earrings',
      image: '/images/earrings_detail.jpg',
      subtitle: 'Articulated drops & heritage cluster domes',
      heightClass: 'h-[270px] sm:h-[480px] lg:h-[580px] sm:mt-12' // staggered downward
    },
    {
      id: 'bangles',
      title: 'Bangles & Kadas',
      category: 'Bracelets',
      image: '/images/temple_bangles.png',
      subtitle: 'Screw-open repoussé cuff bangles',
      heightClass: 'h-[250px] sm:h-[440px] lg:h-[520px]'
    },
    {
      id: 'rings',
      title: 'Solitaires & Rings',
      category: 'Rings',
      image: '/images/ring_detail.jpg',
      subtitle: 'Flush bezels & continuous eternity pavé',
      heightClass: 'h-[270px] sm:h-[480px] lg:h-[580px] sm:mt-12' // staggered downward
    },
    {
      id: 'bridal',
      title: 'Bridal & Royal Sets',
      category: 'Collections',
      image: '/images/kundan_cz.png',
      subtitle: 'Regal Kundan chokers with emerald drops',
      heightClass: 'h-[250px] sm:h-[440px] lg:h-[520px]'
    }
  ];

  const handleCollectionClick = (category) => {
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
                02
              </span>
              <div className="h-px w-8 bg-[#B89B5E]/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
                Curated Categories
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-[0.02em] text-[#1F3A32]">
              The Lookbook <span className="font-serif italic text-[#B89B5E]">Editions</span>
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All Items');
              navigate('/catalog');
            }}
            className="editorial-link-underline self-start sm:self-end text-xs uppercase tracking-[0.22em] text-[#1E1E1E] hover:text-[#B89B5E]"
          >
            <span>View All Collections</span>
            <span>→</span>
          </button>
        </div>

        {/* Desktop Staggered Panels / Mobile Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
          {collections.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCollectionClick(item.category)}
              className={`group relative overflow-hidden cursor-pointer bg-[#142822] shadow-xs ${item.heightClass} w-full transition-all duration-500`}
            >
              {/* Background Portrait Image with Slow Hover Zoom */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Scrim for Legible Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#142822] via-[#142822]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Text Layer over lower portion */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4BE8D] font-medium mb-1.5 opacity-90">
                  {item.subtitle}
                </span>

                <h3 className="font-serif text-xl sm:text-3xl text-[#F8F3EA] font-normal leading-tight tracking-[0.02em] mb-2 sm:mb-3">
                  {item.title}
                </h3>

                {/* 'View' label with gold underline reveal */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#F8F3EA] group-hover:text-[#B89B5E] transition-colors relative">
                    View Edition
                    <span className="block w-0 group-hover:w-full h-px bg-[#B89B5E] transition-all duration-300 -bottom-0.5 absolute left-0" />
                  </span>
                  <span className="text-xs text-[#B89B5E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    →
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

