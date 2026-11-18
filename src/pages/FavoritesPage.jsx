import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useShop } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites, favoritesCount, clearFavorites } = useFavorites();
  const { setCurrentView, setSelectedCategory } = useShop();

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#111111] pb-24">
      
      {/* 1. Header Bar */}
      <div className="border-b border-[#111111]/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#111111] transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-[#111111] font-medium">Saved Pieces</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8935F] font-semibold block">
                Personal Wishlist
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-[#111111] mt-1">
                Your Saved Pieces
              </h1>
              <p className="text-xs text-stone-500 font-light mt-1 max-w-lg">
                Your curated personal selection of handcrafted heirloom designs, rings, necklaces, and bespoke fine jewellery.
              </p>
            </div>

            {favoritesCount > 0 && (
              <div className="flex items-center gap-4 self-start md:self-auto">
                <span className="text-xs uppercase tracking-widest text-stone-500">
                  [{favoritesCount} {favoritesCount === 1 ? 'Design' : 'Designs'}]
                </span>
                <button
                  onClick={clearFavorites}
                  className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Favorites Grid or Empty State */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {favorites.length === 0 ? (
          <div className="text-center py-24 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#111111]/10 flex items-center justify-center mx-auto text-stone-400">
              <Heart className="w-7 h-7 stroke-[1.2]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-light text-[#111111]">
                No favorites yet
              </h2>
              <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
                Click the heart icon on any piece across our collection to save your favorite designs here for later.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All Items');
                  setCurrentView('catalog');
                }}
                className="heirest-btn-dark px-8 py-3.5 text-xs tracking-[0.2em] inline-flex items-center gap-2 shadow-sm"
              >
                <span>Explore Fine Jewellery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.productId || product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
