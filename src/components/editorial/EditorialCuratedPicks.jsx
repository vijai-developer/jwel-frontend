import React from 'react';
import { useShop } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const EditorialCuratedPicks = () => {
  const navigate = useNavigate();
  const { products, addToCart, formatPrice, setSelectedCategory } = useShop();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Pick items: 1 featured piece + 3 lookbook accompaniment pieces
  const items = products && products.length > 0 ? products : [];
  const featuredProduct = items[0] || {
    id: 1,
    name: "Classic Diamond Tennis Bracelet",
    category: "Bracelets",
    price: 5499,
    originalPrice: 8900,
    image: "/images/tennis_bracelet.jpg",
    description: "The definitive wrist icon. Individually bezel-linked stones crafted with double-safety luxury box clasp.",
    metalFinish: "14K Yellow Gold / 18K White Gold"
  };

  const sideProducts = items.slice(1, 4).length === 3 ? items.slice(1, 4) : [
    {
      id: 2,
      name: "Bezel Eternity Ring in 14K Gold",
      category: "Rings",
      price: 3899,
      image: "/images/ring_detail.jpg",
      metalFinish: "14K Solid Yellow Gold"
    },
    {
      id: 3,
      name: "Georgian Drop Huggie & Stud Earrings",
      category: "Earrings",
      price: 2499,
      image: "/images/earrings_detail.jpg",
      metalFinish: "14K Solid Yellow Gold"
    },
    {
      id: 4,
      name: "Royal Goddess Lakshmi Temple Haram",
      category: "Necklaces",
      price: 3499,
      image: "/images/temple_haram.png",
      metalFinish: "24K Micro Gold Plated"
    }
  ];

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-[#F8F3EA] text-[#1E1E1E] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-16 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs font-serif italic text-[#B89B5E] tracking-widest text-lg">
                03
              </span>
              <div className="h-px w-8 bg-[#B89B5E]/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
                Atelier Curation
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-[0.02em] text-[#1F3A32]">
              Curated <span className="font-serif italic text-[#B89B5E]">Picks</span>
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All Items');
              navigate('/catalog');
            }}
            className="editorial-link-underline self-start sm:self-end text-xs uppercase tracking-[0.22em] text-[#1E1E1E] hover:text-[#B89B5E]"
          >
            <span>Explore All Pieces</span>
            <span>→</span>
          </button>
        </div>

        {/* Lookbook Row: 1 Large Featured Product + Column of 3 Smaller Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* 1 Large Featured Piece (Cols 1-7) */}
          <div className="lg:col-span-7 bg-[#FAF6EE] p-4 sm:p-10 border border-[#B89B5E]/20 relative group">
            {/* Wishlist toggle icon */}
            <button
              onClick={() => toggleFavorite(featuredProduct)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors shadow-xs"
              aria-label="Save to wishlist"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isFavorite(featuredProduct.id)
                    ? 'fill-red-500 text-red-500'
                    : 'stroke-[1.5]'
                }`}
              />
            </button>

            {/* Featured Product Image with subtle hover zoom - Medium height on mobile */}
            <div
              onClick={() => handleProductClick(featuredProduct.id)}
              className="editorial-zoom-container aspect-[16/10] sm:aspect-[16/11] max-h-[260px] sm:max-h-none cursor-pointer mb-6 sm:mb-8 bg-[#E9E1D3]"
            >
              <img
                src={featuredProduct.image || "/images/tennis_bracelet.jpg"}
                alt={featuredProduct.name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Featured Details */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pt-2">
              <div className="max-w-md">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89B5E] font-medium block mb-2">
                  Featured Masterpiece • {featuredProduct.category || 'Fine Jewellery'}
                </span>

                <h3
                  onClick={() => handleProductClick(featuredProduct.id)}
                  className="font-serif text-xl sm:text-3xl font-normal text-[#1F3A32] cursor-pointer hover:text-[#B89B5E] transition-colors leading-tight mb-2"
                >
                  {featuredProduct.name}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2 font-light leading-relaxed mb-4">
                  {featuredProduct.description || 'Configured by master artisans and plated in 24K micro-gold with anti-tarnish protective sealing.'}
                </p>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-lg sm:text-2xl text-[#1E1E1E] font-medium">
                    {formatPrice ? formatPrice(featuredProduct.price) : `₹${featuredProduct.price}`}
                  </span>
                  {featuredProduct.originalPrice && (
                    <span className="text-xs text-gray-400 line-through font-light">
                      {formatPrice ? formatPrice(featuredProduct.originalPrice) : `₹${featuredProduct.originalPrice}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Text-style 'Add to Bag' link using existing cart handler */}
              <button
                onClick={() => addToCart(featuredProduct)}
                className="editorial-link-underline self-start sm:self-end text-xs uppercase tracking-[0.2em] font-semibold text-[#1F3A32] hover:text-[#B89B5E] pb-1 cursor-pointer whitespace-nowrap"
              >
                <span>Add to Bag</span>
                <span>+</span>
              </button>
            </div>
          </div>

          {/* Column of 3 Smaller Product Cards (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {sideProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-4 sm:gap-5 p-3.5 sm:p-5 bg-[#FAF6EE] border border-[#B89B5E]/20 transition-all hover:border-[#B89B5E]/50 group"
              >
                {/* Product Thumbnail - Compact & medium on phone */}
                <div
                  onClick={() => handleProductClick(prod.id)}
                  className="editorial-zoom-container w-24 h-24 sm:w-32 sm:h-32 shrink-0 cursor-pointer bg-[#E9E1D3]"
                >
                  <img
                    src={prod.image || "/images/ring_detail.jpg"}
                    alt={prod.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                {/* Info & Add-to-bag */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#B89B5E] font-medium block mb-1">
                    {prod.category || 'Atelier'}
                  </span>

                  <h4
                    onClick={() => handleProductClick(prod.id)}
                    className="font-serif text-base sm:text-xl font-normal text-[#1F3A32] truncate cursor-pointer hover:text-[#B89B5E] transition-colors mb-1.5 sm:mb-2"
                  >
                    {prod.name}
                  </h4>

                  <div className="font-serif text-sm sm:text-base text-[#1E1E1E] font-medium mb-2 sm:mb-3">
                    {formatPrice ? formatPrice(prod.price) : `₹${prod.price}`}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Always visible text-style Add to Bag */}
                    <button
                      onClick={() => addToCart(prod)}
                      className="editorial-link-underline text-[11px] uppercase tracking-[0.18em] font-medium text-[#1F3A32] hover:text-[#B89B5E] cursor-pointer"
                    >
                      <span>Add to Bag</span>
                      <span>+</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(prod)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(prod.id)
                            ? 'fill-red-500 text-red-500'
                            : 'stroke-[1.5]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

