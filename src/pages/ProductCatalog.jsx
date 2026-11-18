import React, { useState, useMemo } from 'react';
import { useShop, useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/initialProducts';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Filter, 
  X, 
  RotateCcw, 
  ShoppingBag, 
  Heart, 
  Camera, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Grid3X3, 
  LayoutGrid, 
  ChevronRight
} from 'lucide-react';

const LUXURY_CATEGORIES = [
  'All Items',
  'Rings',
  'Earrings',
  'Bracelets',
  'Necklaces',
  'Collections'
];

export const ProductCatalog = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchTerm, 
    setSearchTerm,
    setCurrentView
  } = useShop();

  const [sortOption, setSortOption] = useState('featured');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [gridCols, setGridCols] = useState(4); // 3 or 4 columns

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter
      if (selectedCategory && selectedCategory !== 'All Items') {
        const prodCat = product.category?.toLowerCase() || '';
        const targetCat = selectedCategory.toLowerCase();
        if (targetCat === 'rings' && !prodCat.includes('ring') && !product.name.toLowerCase().includes('ring')) return false;
        if (targetCat === 'earrings' && !prodCat.includes('earring') && !product.name.toLowerCase().includes('earring') && !product.name.toLowerCase().includes('jhumka')) return false;
        if (targetCat === 'bracelets' && !prodCat.includes('bracelet') && !prodCat.includes('bangle') && !product.name.toLowerCase().includes('bracelet') && !product.name.toLowerCase().includes('kada') && !product.name.toLowerCase().includes('bangle')) return false;
        if (targetCat === 'necklaces' && !prodCat.includes('necklace') && !prodCat.includes('haram') && !prodCat.includes('choker') && !product.name.toLowerCase().includes('necklace') && !product.name.toLowerCase().includes('haram') && !product.name.toLowerCase().includes('choker')) return false;
        if (targetCat === 'collections' && product.category !== 'Collections' && !prodCat.includes('temple') && !prodCat.includes('bespoke')) return false;
      }

      // 2. Search Filter
      if (searchTerm?.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(query);
        const matchCat = product.category?.toLowerCase().includes(query);
        const matchStones = product.stones?.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchStones) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortOption === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [products, selectedCategory, searchTerm, sortOption]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#111111] pb-20">
      
      {/* 1. Clean Editorial Header Bar */}
      <div className="border-b border-[#111111]/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#111111]">Home</button>
            <span>/</span>
            <span className="text-[#111111]">{selectedCategory || 'Shop All'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-[#111111]">
                {selectedCategory === 'All Items' ? 'Shop All Fine Jewellery' : selectedCategory}
              </h1>
              <p className="text-xs text-stone-500 font-light mt-1 max-w-lg">
                Configured by you and crafted to last. Lifetime warranty and complimentary insured shipping.
              </p>
            </div>

            <span className="text-xs uppercase tracking-widest text-stone-500 self-start md:self-auto">
              [{filteredProducts.length} {filteredProducts.length === 1 ? 'Design' : 'Designs'}]
            </span>
          </div>

          {/* Minimalist Horizontal Filter Tabs */}
          <div className="pt-4 flex items-center justify-between border-t border-[#111111]/10 flex-wrap gap-4">
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-2 py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {LUXURY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] font-medium transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#111111] text-white'
                      : 'bg-white border border-[#111111]/15 text-stone-700 hover:border-[#111111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Grid Toggle */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto bg-white border border-[#111111]/15 px-3 py-2 text-[10px] uppercase tracking-wider text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Releases</option>
              </select>

              <div className="hidden sm:flex items-center border border-[#111111]/15 bg-white">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 ${gridCols === 3 ? 'bg-[#111111] text-white' : 'text-stone-600'}`}
                  title="3 Columns"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 ${gridCols === 4 ? 'bg-[#111111] text-white' : 'text-stone-600'}`}
                  title="4 Columns"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-sm font-serif text-stone-500">No pieces found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All Items');
                setSearchTerm('');
              }}
              className="heirest-btn-dark px-6 py-2.5 text-[10px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 ${gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-3 sm:gap-8`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
