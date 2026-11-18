import React from 'react';

export const EditorialGalleryStrip = () => {
  const galleryItems = [
    { id: 1, image: '/images/earrings_detail.jpg', alt: 'Editorial huggie earrings' },
    { id: 2, image: '/images/ring_detail.jpg', alt: 'Bezel eternity solitaire ring' },
    { id: 3, image: '/images/tennis_necklace.jpg', alt: 'Graduated tennis necklace' },
    { id: 4, image: '/images/temple_bangles.png', alt: 'Micro gold temple kada' },
    { id: 5, image: '/images/gold_jhumka.png', alt: 'Peacock antique gold jhumkas' },
    { id: 6, image: '/images/cz_choker.png', alt: 'Imperial white gold choker' }
  ];

  return (
    <section className="bg-[#FAF6EE] pt-16 border-t border-[#B89B5E]/20 overflow-hidden">
      {/* Editorial Handle Header */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89B5E] font-medium block mb-1">
          Daily Atelier Dispatch
        </span>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-xl sm:text-2xl text-[#1F3A32] hover:text-[#B89B5E] transition-colors tracking-wide inline-flex items-center gap-2"
        >
          <span>Follow @sushmajewels</span>
          <span className="text-xs font-light">↗</span>
        </a>
      </div>

      {/* Row of 6 square images edge to edge */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full">
        {galleryItems.map((item) => (
          <a
            key={item.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-zoom-container aspect-square relative group bg-[#E9E1D3] block overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle dark hover veil */}
            <div className="absolute inset-0 bg-[#1F3A32]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F8F3EA] font-medium border border-[#F8F3EA]/60 px-3 py-1">
                View Story
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

