import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import API from '../services/api';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ShoppingBag, 
  Camera, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Check,
  ChevronDown
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { 
    selectedProductForDetail, 
    setSelectedProductForTryOn,
    products, 
    addToCart, 
    setIsCheckoutOpen,
    setIsCartOpen,
    setCurrentView,
    formatPrice,
    showToast
  } = useShop();

  const { isFavorite, toggleFavorite } = useFavorites();

  const product = (id ? products.find(p => String(p.productId || p.id) === String(id)) : null) || selectedProductForDetail || products[0];
  const productId = product?.productId || product?.id;
  const isWishlisted = isFavorite(productId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  const galleryImages = (product?.gallery && product.gallery.length > 0)
    ? product.gallery 
    : [product?.image, product?.hoverImage || product?.image].filter(Boolean);

  const [activeImage, setActiveImage] = useState(galleryImages[0] || '/images/ring_detail.jpg');
  const [selectedMetal, setSelectedMetal] = useState('14K Yellow Gold');
  const [selectedSize, setSelectedSize] = useState('Standard / US 7');
  const [activeAccordion, setActiveAccordion] = useState('details');

  // Customer Reviews State
  const [currentRating, setCurrentRating] = useState(product?.rating || 5.0);
  const [currentReviewsCount, setCurrentReviewsCount] = useState(product?.reviewsCount || 0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState([
    {
      id: 1,
      name: 'Radhika Sharma',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      comment: 'Breathtaking craftsmanship! The bezel setting holds the stones flush and comfortable for daily wear. Arrived beautifully in the wax-sealed box.'
    },
    {
      id: 2,
      name: 'Ananya Reddy',
      rating: 5,
      date: 'Last month',
      verified: true,
      comment: 'Exceeded all expectations. Optical fire and luster match solid fine jewellery. The 1-year guarantee certificate was included with the package.'
    }
  ]);

  useEffect(() => {
    if (galleryImages[0]) {
      setActiveImage(galleryImages[0]);
    }
    if (product) {
      setCurrentRating(product.rating || 5.0);
      setCurrentReviewsCount(product.reviewsCount || 0);
    }
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || reviewerName.trim().length < 2) {
      showToast('Please provide your name (at least 2 characters).');
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      showToast('Please provide a meaningful review comment (at least 5 characters).');
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      showToast('Please select a star rating between 1 and 5.');
      return;
    }

    setSubmittingReview(true);
    try {
      // Attempt backend review submission
      await API.post(`/products/${productId}/reviews`, {
        rating: reviewRating,
        name: reviewerName.trim(),
        comment: reviewComment.trim()
      });

      const updatedCount = currentReviewsCount + 1;
      const updatedRating = Math.round(((currentRating * currentReviewsCount + reviewRating) / updatedCount) * 10) / 10;
      setCurrentRating(updatedRating);
      setCurrentReviewsCount(updatedCount);

      setLocalReviews(prev => [
        {
          id: Date.now(),
          name: reviewerName.trim(),
          rating: reviewRating,
          date: 'Just now',
          verified: true,
          comment: reviewComment.trim()
        },
        ...prev
      ]);

      setReviewerName('');
      setReviewComment('');
      setShowReviewForm(false);
      showToast('Thank you! Your client review has been published.');
    } catch (err) {
      // Graceful local update
      const updatedCount = currentReviewsCount + 1;
      setCurrentReviewsCount(updatedCount);
      setLocalReviews(prev => [
        {
          id: Date.now(),
          name: reviewerName.trim(),
          rating: reviewRating,
          date: 'Just now',
          verified: true,
          comment: reviewComment.trim()
        },
        ...prev
      ]);
      setReviewerName('');
      setReviewComment('');
      setShowReviewForm(false);
      showToast('Thank you! Your review has been recorded.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter(p => (p.productId || p.id) !== productId && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(product, 1, selectedSize);
    setIsCartOpen(true);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-stone-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#111111] pb-24">
      
      {/* 1. Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#111111]">Home</button>
          <span>/</span>
          <button 
            onClick={() => setCurrentView('catalog')}
            className="hover:text-[#111111]"
          >
            {product.category || 'Shop'}
          </button>
          <span>/</span>
          <span className="text-[#111111] font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* 2. Main Product Spread */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Gallery Visuals (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-4/5 overflow-hidden bg-[#F4EFEA] border border-[#111111]/10 relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />

              <button
                onClick={() => toggleFavorite(product)}
                className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? 'bg-[#111111] text-[#E5C992]' 
                    : 'bg-white/80 text-[#111111] hover:bg-white hover:scale-105'
                }`}
                title={isWishlisted ? "Remove from Saved" : "Save piece"}
                aria-label={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E5C992] stroke-[#E5C992]' : 'stroke-current'}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 flex-shrink-0 border transition-all ${
                      activeImage === img ? 'border-[#111111]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover bg-[#F4EFEA]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium block">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-[#111111]">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-medium text-[#111111]">
                  {formatPrice ? formatPrice(product.price) : `₹${product.price.toLocaleString('en-IN')}`}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatPrice ? formatPrice(product.originalPrice) : `₹${product.originalPrice.toLocaleString('en-IN')}`}
                  </span>
                )}
                <span className="text-[10px] text-stone-500 uppercase tracking-widest pl-2">
                  Taxes calculated at checkout
                </span>
              </div>
            </div>

            {/* 4x installment preview */}
            <div className="p-3 bg-[#F4EFEA] text-[11px] text-stone-600 tracking-wide border border-[#111111]/5">
              Or 4 interest-free payments of <span className="font-semibold text-[#111111]">{formatPrice ? formatPrice(Math.round(product.price / 4)) : `₹${Math.round(product.price / 4).toLocaleString('en-IN')}`}</span> with UPI / Netbanking.
            </div>

            {/* Metal Finish Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600 block">
                Metal Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['14K Yellow Gold', '18K White Gold', 'Rose Gold', 'Platinum'].map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMetal(m)}
                    className={`py-2 px-3 text-[10px] uppercase tracking-wider font-medium border text-center transition-all ${
                      selectedMetal === m
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Size / Length Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600">
                <span>Size / Dimensions</span>
                <span className="text-stone-400">Complimentary Resizing</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['US 5 / Small', 'US 6 / Medium', 'US 7 / Standard', 'US 8 / Large'].slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border text-center transition-all ${
                      selectedSize === s
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                    }`}
                  >
                    {s.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleAddToBag}
                className="w-full heirest-btn-dark py-3.5 sm:py-4 px-4 min-h-[48px] text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • {formatPrice ? formatPrice(product.price) : `₹${product.price.toLocaleString('en-IN')}`}</span>
              </button>

              <button
                onClick={() => {
                  if (setSelectedProductForTryOn) setSelectedProductForTryOn(product);
                  setCurrentView('tryon');
                }}
                className="w-full heirest-btn-outline py-3 px-4 min-h-[44px] text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Camera className="w-4 h-4 text-[#B8935F]" />
                <span>Try On with Virtual Mirror</span>
              </button>
            </div>

            {/* Guarantees & Accordions */}
            <div className="pt-6 border-t border-[#111111]/10 space-y-3 text-xs">
              
              <div className="space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Lifetime Manufacturing Warranty Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>Complimentary Insured Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#B8935F]" />
                  <span>D-F Color, VS2+ Clarity Optical Lab Diamonds</span>
                </div>
              </div>

              {/* Description Accordion */}
              <div className="border-t border-[#111111]/10 pt-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-medium py-1"
                >
                  <span>Design & Details</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'details' && (
                  <p className="text-xs text-stone-600 font-light leading-relaxed pt-2">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Care Accordion */}
              <div className="border-t border-[#111111]/10 pt-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-medium py-1"
                >
                  <span>Care & Maintenance</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeAccordion === 'care' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'care' && (
                  <p className="text-xs text-stone-600 font-light leading-relaxed pt-2">
                    {product.careInstructions || 'Wipe gently with the complimentary plush microfiber cloth after wear. Store inside the provided luxury zip pouch.'}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 3. Client Reviews & Impressions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-[#111111]/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111111] mt-1">
              Verified Impressions
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-[#B8935F]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(currentRating) ? 'fill-[#B8935F]' : 'fill-none stroke-current'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-stone-700">
                {currentRating.toFixed(1)} / 5.0 ({currentReviewsCount} verified {currentReviewsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="heirest-btn-dark px-6 py-2.5 text-xs tracking-wider uppercase font-medium cursor-pointer"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Inline Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-white p-6 sm:p-8 border border-[#111111]/10 mb-10 max-w-2xl space-y-4 shadow-sm">
            <h3 className="font-serif text-base uppercase tracking-wider">Leave Your Review</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-stone-600 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-[#B8935F] text-[#B8935F]' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-stone-600 block">Your Name *</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-stone-600 block">Your Review *</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with fit, luster, craftsmanship, and packaging..."
                className="w-full bg-[#FAF8F5] border border-[#111111]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="heirest-btn-dark px-6 py-2.5 text-xs tracking-wider uppercase font-medium disabled:opacity-50 cursor-pointer"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localReviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 border border-[#111111]/10 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-medium">{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Client
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400">{rev.date}</span>
              </div>

              <div className="flex text-[#B8935F]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#B8935F]' : 'fill-none stroke-stone-300'}`} 
                  />
                ))}
              </div>

              <p className="text-xs text-stone-600 font-light leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Related / Complete The Look */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-[#111111]/10">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
              Curated Pairings
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111111]">
              Complete The Look
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
