import React, { useState, useEffect } from 'react';
import { useShop, useCart } from '../context/CartContext';
import { 
  Camera, 
  Upload, 
  ShoppingBag, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Sparkles, 
  X, 
  Check 
} from 'lucide-react';

const SAMPLE_MODELS = [
  { id: 'm1', name: 'Model Priya (Traditional)', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
  { id: 'm2', name: 'Model Ananya (Bridal)', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80' },
  { id: 'm3', name: 'Model Deepa (Festive)', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80' }
];

export const VirtualTryOnModal = () => {
  const { 
    products, 
    selectedProductForTryOn, 
    setSelectedProductForTryOn, 
    addToCart,
    setCurrentView,
    formatPrice
  } = useShop();

  const [selectedProduct, setSelectedProduct] = useState(
    selectedProductForTryOn || products[0]
  );

  useEffect(() => {
    if (selectedProductForTryOn) {
      setSelectedProduct(selectedProductForTryOn);
    }
  }, [selectedProductForTryOn]);
  const [modelImage, setModelImage] = useState(SAMPLE_MODELS[0].image);
  
  // Transform Controls State for Overlay
  const [position, setPosition] = useState({ x: 0, y: 30 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setModelImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#2C2E2B]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD1] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#C5A059] animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold font-royal gold-text-gradient">
              Interactive Virtual Jewellery Try-On Studio
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            See how Sushma Jewels covering harams, jhumkas, and chokers look on you before ordering!
          </p>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="gold-outline-button px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap"
        >
          Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Visualizer Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#FAF6F0] rounded-3xl border-2 border-[#C5A059]/40 overflow-hidden relative shadow-lg h-[500px] flex items-center justify-center select-none"
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}>
            
            {/* Model Image */}
            <img
              src={modelImage}
              alt="Model Face"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Overlay Jewellery */}
            {selectedProduct && (
              <div
                onMouseDown={handleMouseDown}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                className="absolute transition-transform duration-75 group"
              >
                <div className="relative">
                  <img
                    src={selectedProduct.image || '/images/temple_haram.png'}
                    alt={selectedProduct.name}
                    className="w-48 h-48 object-contain filter drop-shadow-[0_10px_20px_rgba(197,160,89,0.5)] pointer-events-none mix-blend-multiply"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-[#C5A059] opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none" />
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8DFD1] flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
              
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D31] font-bold flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-[#C5A059]" /> Size:
                </span>
                <button 
                  onClick={() => setScale(prev => Math.max(0.4, prev - 0.1))}
                  className="p-1 bg-[#FAF6F0] rounded border border-[#E8DFD1] hover:text-[#C5A059]"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs w-10 text-center font-bold">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={() => setScale(prev => Math.min(2.5, prev + 0.1))}
                  className="p-1 bg-[#FAF6F0] rounded border border-[#E8DFD1] hover:text-[#C5A059]"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#8C6D31] font-bold flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" /> Angle:
                </span>
                <button 
                  onClick={() => setRotation(prev => prev - 10)}
                  className="p-1 bg-[#FAF6F0] rounded border border-[#E8DFD1] hover:text-[#C5A059]"
                >
                  -10°
                </button>
                <button 
                  onClick={() => setRotation(prev => prev + 10)}
                  className="p-1 bg-[#FAF6F0] rounded border border-[#E8DFD1] hover:text-[#C5A059]"
                >
                  +10°
                </button>
                <button 
                  onClick={() => { setPosition({ x: 0, y: 30 }); setScale(1); setRotation(0); }}
                  className="px-2.5 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DFD1] text-[10px] text-gray-600 hover:text-black font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Model Switcher & Selfie Upload */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFD1] flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#8C6D31]">Choose Model Face:</span>
              <div className="flex gap-2">
                {SAMPLE_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setModelImage(m.image)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      modelImage === m.image ? 'border-[#C5A059] scale-110' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                    title={m.name}
                  >
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <label className="gold-outline-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Upload Your Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

        </div>

        {/* Right Jewellery Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] space-y-4 shadow-xs">
            <h3 className="text-base font-bold font-royal text-[#8C6D31]">Select Jewellery Piece to Try On</h3>

            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedProduct?.id === p.id 
                      ? 'bg-[#FAF0E4] border-[#C5A059] shadow-sm scale-102' 
                      : 'bg-white border-[#E8DFD1] hover:border-[#C5A059]'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                  <h4 className="text-xs font-bold text-[#2C2E2B] line-clamp-1">{p.name}</h4>
                  <span className="text-xs font-extrabold text-[#8C6D31] mt-1">₹{p.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Selected Product Actions */}
            {selectedProduct && (
              <div className="pt-4 border-t border-[#E8DFD1] flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#2C2E2B]">{selectedProduct.name}</h4>
                  <span className="text-xs text-emerald-700 font-bold">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="gold-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ADD TO BAG</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
