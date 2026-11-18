import React from 'react';
import { useShop } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, ArrowRight, Camera } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    setSelectedProductForDetail, 
    setSelectedProductForTryOn,
    navigateToProductDetail,
    setCurrentView,
    formatPrice 
  } = useShop();

  const { isFavorite, toggleFavorite } = useFavorites();

  const productId = product.productId || product.id;
  const isWishlisted = isFavorite(productId);
  const primaryImage = product.image || product.gallery?.[0] || '/images/ring_detail.jpg';
  const secondImage = product.hoverImage || product.gallery?.[1] || primaryImage;

  const handleProductClick = () => {
    if (navigateToProductDetail) {
      navigateToProductDetail(product);
    } else {
      setSelectedProductForDetail(product);
      setCurrentView('product-detail');
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="group flex flex-col cursor-pointer" onClick={handleProductClick}>
      
      {/* Visual Image Container with Dual Image Swap */}
      <div className="relative aspect-4/5 overflow-hidden bg-[#F4EFEA] border border-[#111111]/5 product-image-swap">
        <img
          src={primaryImage}
          alt={product.name}
          className="img-primary w-full h-full object-cover"
          loading="lazy"
        />
        <img
          src={secondImage}
          alt={`${product.name} alternate view`}
          className="img-secondary w-full h-full object-cover"
          loading="lazy"
        />

        {/* Minimal Luxury Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="editorial-pill text-[9px] bg-white/90 text-[#111111] px-2 py-0.5">
              Most Loved
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="editorial-pill text-[9px] bg-[#111111] text-white px-2 py-0.5">
              New Release
            </span>
          )}
        </div>

        {/* Wishlist Toggle Heart Button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted 
              ? 'bg-[#111111] text-[#E5C992] shadow-xs scale-105' 
              : 'bg-white/80 text-[#111111] hover:bg-white hover:scale-110'
          }`}
          title={isWishlisted ? "Remove from Saved" : "Save to Favorites"}
          aria-label={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#E5C992] stroke-[#E5C992]' : 'stroke-current'}`} />
        </button>

        {/* Floating Quick Action Bar (Desktop Hover Only) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (setSelectedProductForTryOn) setSelectedProductForTryOn(product);
              setCurrentView('tryon');
            }}
            className="bg-white/95 hover:bg-white text-[#111111] p-2 text-[10px] tracking-wider uppercase font-medium shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title="Try On Piece with Virtual Studio"
            aria-label="Try On"
          >
            <Camera className="w-3.5 h-3.5 text-[#B8935F]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 heirest-btn-dark py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Shop This Design</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Clean Minimal Typography */}
      <div className="pt-3 pb-1 flex flex-col space-y-1 text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium">
          {product.category}
        </span>

        <h3 className="text-xs sm:text-sm font-serif text-[#111111] font-normal group-hover:text-[#B8935F] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className="text-xs sm:text-sm font-medium text-[#111111] tracking-wide">
            {formatPrice ? formatPrice(product.price) : `₹${product.price.toLocaleString('en-IN')}`}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] text-stone-400 line-through">
              {formatPrice ? formatPrice(product.originalPrice) : `₹${product.originalPrice.toLocaleString('en-IN')}`}
            </span>
          )}
        </div>

        {/* Mobile-Only Action Button Bar (Always Accessible on Touch Screens) */}
        <div className="sm:hidden flex items-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (setSelectedProductForTryOn) setSelectedProductForTryOn(product);
              setCurrentView('tryon');
            }}
            className="p-2 border border-[#B89B5E]/50 rounded-xs bg-white text-[#1F3A32] active:bg-[#B89B5E]/10 flex items-center justify-center shrink-0 cursor-pointer"
            title="Try On Piece"
            aria-label="Try On"
          >
            <Camera className="w-3.5 h-3.5 text-[#B8935F]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 heirest-btn-dark py-2 px-2 text-[9px] tracking-[0.14em] uppercase font-medium flex items-center justify-center gap-1 rounded-xs cursor-pointer active:scale-95"
          >
            <span>Add to Bag</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
