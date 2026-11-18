import React, { useState } from 'react';
import { useShop } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  Heart, 
  Truck
} from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    addToCart, 
    setIsCartOpen,
    setCurrentView
  } = useShop();

  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const productId = product.productId || product.id;
  const isWishlisted = isFavorite(productId);
  const activeImage = selectedImage || product.gallery?.[0] || product.image || '/images/ring_detail.jpg';

  const handleAddAndClose = () => {
    addToCart(product, 1);
    setSelectedProductForDetail(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#111111]/15 max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 text-[#111111]">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-[#111111] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative aspect-4/5 overflow-hidden bg-[#F4EFEA] border border-[#111111]/10">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 border transition-all ${
                      activeImage === img ? 'border-[#111111]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover bg-[#F4EFEA]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium block">
                {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111111]">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-base font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#111111]/10">
              <div className="text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Lifetime Manufacturing Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Complimentary Insured Shipping</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleAddAndClose}
                  className="flex-1 heirest-btn-dark py-3 text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleFavorite(product)}
                  className={`p-3 border transition-all ${
                    isWishlisted 
                      ? 'border-[#111111] bg-[#111111] text-[#E5C992]' 
                      : 'border-[#111111]/20 hover:border-[#111111]'
                  }`}
                  title={isWishlisted ? "Remove from Saved" : "Save to Favorites"}
                  aria-label={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E5C992] stroke-[#E5C992]' : 'stroke-current'}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedProductForDetail(null);
                  setCurrentView('product-detail');
                }}
                className="w-full text-center text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#111111] pt-1"
              >
                View Full Product Page & Customizer ➔
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
