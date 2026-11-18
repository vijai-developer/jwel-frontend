import React, { useState } from 'react';
import { useShop, useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Gem, 
  Award, 
  Check, 
  Star,
  Sliders,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';

export const Storefront = () => {
  const { 
    products, 
    setCurrentView, 
    setSelectedCategory, 
    setSelectedProductForDetail,
    navigateToProductDetail,
    addToCart,
    formatPrice
  } = useShop();

  // Interactive Live Configurator State (Heirest style)
  const [configMetal, setConfigMetal] = useState('14K Yellow Gold');
  const [configStone, setConfigStone] = useState('Oval Lab Diamond');
  const [configSetting, setConfigSetting] = useState('Bezel');
  const [configCarat, setConfigCarat] = useState('2.0 TCW');

  // Dynamic calculated price for configurator
  const getCalculatedPrice = () => {
    let base = 3499;
    if (configMetal.includes('18K')) base += 800;
    if (configMetal.includes('Platinum')) base += 1200;
    if (configCarat.includes('3.0')) base += 1500;
    if (configCarat.includes('4.0')) base += 2800;
    return base;
  };

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const activeConfigProduct = {
    id: `custom-config-${Date.now()}`,
    name: `Custom ${configSetting} Design (${configMetal})`,
    category: 'Rings',
    price: getCalculatedPrice(),
    originalPrice: getCalculatedPrice() + 2500,
    metalFinish: configMetal,
    stones: `${configStone} (${configCarat})`,
    image: '/images/ring_detail.jpg',
    hoverImage: '/images/heirest_hero.jpg',
    description: `Bespoke configuration: ${configSetting} setting with ${configStone} in solid ${configMetal}. Handcrafted in our atelier with lifetime warranty.`
  };

  return (
    <div className="space-y-24 pb-20 text-[#111111] bg-[#FAF8F5]">
      
      {/* 1. HERO SECTION — High-Impact Editorial Luxury Photography */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end justify-start overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/heirest_hero.jpg"
            alt="Fine Jewellery, Authored By You"
            className="w-full h-full object-cover object-center filter brightness-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24 w-full text-white space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-[0.25em] font-medium">
            <Sparkles className="w-3 h-3 text-[#E5C992]" />
            <span>FINE JEWELLERY, AUTHORED BY YOU</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light leading-[1.05] tracking-tight max-w-3xl">
            Author what others inherit.
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 max-w-md font-light tracking-wide leading-relaxed">
            Every decision yours. Every step visible. Configured by you and crafted to last with lifetime warranty.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('All Items');
                setCurrentView('catalog');
              }}
              className="bg-white text-[#111111] hover:bg-[#FAF8F5] transition-all px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase shadow-lg"
            >
              Design Yours
            </button>

            <button
              onClick={() => setCurrentView('tryon')}
              className="bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#111111] transition-all px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5 text-[#E5C992]" />
              <span>Virtual Mirror</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROOF TICKER STRIP — Minimalist Caps */}
      <section className="border-y border-[#111111]/10 py-4 bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-stone-600 font-medium text-center sm:text-left">
            <span>Clarity & Transparency at every step</span>
            <span className="hidden md:inline">•</span>
            <span>Complimentary worldwide shipping</span>
            <span className="hidden md:inline">•</span>
            <span>Lifetime manufacturing warranty</span>
            <span className="hidden md:inline">•</span>
            <span>Every piece crafted by hand</span>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL LOOKBOOK SPOTLIGHT ("Time-honoured finery, authored by you.") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
            Atelier Spotlight
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#111111]">
            Time-honoured finery, authored by you.
          </h2>
        </div>

        {/* Big Editorial Feature Banner */}
        <div className="relative aspect-16/9 sm:aspect-21/9 rounded-none overflow-hidden group bg-[#F4EFEA] border border-[#111111]/10">
          <img
            src="/images/ring_detail.jpg"
            alt="Bezel Eternity Ring Stacking"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Author Badge & Metadata Overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#E5C992] block">
                Author: @sushma_atelier
              </span>
              <p className="text-sm sm:text-base font-serif font-light tracking-wide">
                Bezel Eternity Ring / 14K Yellow Gold / White Lab Diamond / Oval
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('Rings');
                setCurrentView('catalog');
              }}
              className="bg-white text-[#111111] hover:bg-[#FAF8F5] px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium self-start sm:self-auto transition-colors"
            >
              Configure This Design
            </button>
          </div>
        </div>

        {/* Quick Category Navigation Bar */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-xs tracking-[0.2em] uppercase font-medium">
          {['All Items', 'Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Collections'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentView('catalog');
              }}
              className="py-2 px-4 border border-[#111111]/15 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-[10px]"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE 3D CONFIGURATOR PREVIEW (Heirest 250k combination builder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] border border-[#111111]/10 p-8 sm:p-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual Preview Left (6 cols) */}
            <div className="lg:col-span-6 relative aspect-square bg-white border border-[#111111]/10 overflow-hidden group">
              <img
                src={activeConfigProduct.image || '/images/ring_detail.jpg'}
                alt="Realtime Configurator Render"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-medium border border-[#111111]/10">
                Live 3D Render
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 border border-[#111111]/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest block">Selected Config</span>
                  <span className="text-xs font-serif font-medium">{configMetal} • {configStone}</span>
                </div>
                <span className="text-sm font-semibold">{formatPrice(getCalculatedPrice())}</span>
              </div>
            </div>

            {/* Controls Right (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
                  Digital Configurator
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#111111] font-normal mt-1">
                  Design your custom bespoke piece
                </h3>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Every selection is rendered with real-time pricing calculated transparently.
                </p>
              </div>

              {/* 1. Metal Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600 block">
                  1. Choose Metal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['14K Yellow Gold', '18K White Gold', 'Rose Gold', 'Platinum'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfigMetal(m)}
                      className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border text-center transition-all ${
                        configMetal === m
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Stone Cut */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600 block">
                  2. Diamond / Stone Cut
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Oval Lab Diamond', 'Round Brilliant', 'Emerald Cut', 'Pear Cut'].map(s => (
                    <button
                      key={s}
                      onClick={() => setConfigStone(s)}
                      className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border text-center transition-all ${
                        configStone === s
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                      }`}
                    >
                      {s.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Setting Style */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-600 block">
                  3. Setting Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Bezel Flush', 'Prong Solitaire', 'Georgian Articulated'].map(st => (
                    <button
                      key={st}
                      onClick={() => setConfigSetting(st)}
                      className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border text-center transition-all ${
                        configSetting === st
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-stone-300 bg-white hover:border-stone-500 text-stone-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-3 flex items-center gap-4">
                <button
                  onClick={() => addToCart(activeConfigProduct)}
                  className="flex-1 heirest-btn-dark py-3.5 text-center text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <span>Order Configured Piece • {formatPrice(getCalculatedPrice())}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. VISUAL CATEGORIES SHOWCASE — Full Bleed Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
            Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] font-light">
            Shop By Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Rings', cat: 'Rings', img: '/images/ring_detail.jpg' },
            { title: 'Earrings', cat: 'Earrings', img: '/images/earrings_detail.jpg' },
            { title: 'Bracelets', cat: 'Bracelets', img: '/images/tennis_bracelet.jpg' },
            { title: 'Necklaces', cat: 'Necklaces', img: '/images/tennis_necklace.jpg' }
          ].map(c => (
            <div
              key={c.cat}
              onClick={() => {
                setSelectedCategory(c.cat);
                setCurrentView('catalog');
              }}
              className="relative aspect-3/4 overflow-hidden group cursor-pointer bg-[#F4EFEA] border border-[#111111]/5"
            >
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <span className="text-xs sm:text-sm font-serif uppercase tracking-[0.2em]">{c.title}</span>
                <span className="text-[10px] uppercase tracking-widest text-[#E5C992] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Explore <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BESTSELLING CONFIGURATIONS — 4 Column Clean Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#111111]/10 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[#B8935F] uppercase font-semibold block">
              Iconic Pieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#111111] font-light mt-1">
              Our most loved configurations
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setCurrentView('catalog');
            }}
            className="text-xs text-[#111111] font-medium hover:text-[#B8935F] flex items-center gap-1 self-start sm:self-auto uppercase tracking-widest"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. EDITORIAL SPLIT SPREAD & BRAND MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F4EFEA] border border-[#111111]/10 p-8 sm:p-14">
          
          {/* Left Editorial Visual (6 cols) */}
          <div className="lg:col-span-6 relative aspect-4/3 overflow-hidden bg-white border border-[#111111]/10">
            <img
              src="/images/tennis_necklace.jpg"
              alt="Diamond Tennis Solitaire Necklace"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Editorial Copy (6 cols) */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
              The Manifesto
            </span>

            <blockquote className="text-xl sm:text-2xl font-serif font-light text-[#111111] leading-relaxed italic">
              "The whole process was flawless: from design, to seeing the render, and then receiving the real thing."
            </blockquote>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Fine jewellery has long been shaped by convention, placing the decision in everyone's hands but yours. SUSHMA resets that standard: modern engineering, with a reverence for craft to create timeless pieces with total transparency.
            </p>

            <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#111111]">
              For those who choose to author what others inherit.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('Necklaces');
                  setCurrentView('catalog');
                }}
                className="heirest-btn-dark px-8 py-3.5 inline-flex items-center gap-2"
              >
                <span>Shop Graduated Tennis Necklace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. OUR STANDARDS (4 PHOTOGRAPHIC TILES) */}
      <section id="standards-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
            Craft & Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] font-light">
            Our Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-[#111111]/10 p-6 space-y-4">
            <div className="aspect-4/3 overflow-hidden bg-[#F4EFEA]">
              <img src="/images/atelier_craft.jpg" alt="Hand Finished" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-medium font-serif">Hand-Finished Precision</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Every piece is finished by hand: set, polished and inspected by master jewellers with decades of fine jewellery experience.
            </p>
          </div>

          <div className="bg-white border border-[#111111]/10 p-6 space-y-4">
            <div className="aspect-4/3 overflow-hidden bg-[#F4EFEA]">
              <img src="/images/ring_detail.jpg" alt="Optically Flawless" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-medium font-serif">Flawless Diamonds</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Meticulously selected to exact specifications: D–F colour, VS2 clarity or greater, and Excellent cut with optical brilliance.
            </p>
          </div>

          <div className="bg-white border border-[#111111]/10 p-6 space-y-4">
            <div className="aspect-4/3 overflow-hidden bg-[#F4EFEA]">
              <img src="/images/tennis_bracelet.jpg" alt="Worldwide Shipping" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-medium font-serif">Insured Shipping</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Made-to-order and dispatched with complimentary, fully insured worldwide express shipping in discreet velvet packaging.
            </p>
          </div>

          <div className="bg-white border border-[#111111]/10 p-6 space-y-4">
            <div className="aspect-4/3 overflow-hidden bg-[#F4EFEA]">
              <img src="/images/earrings_detail.jpg" alt="Lifetime Warranty" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-medium font-serif">Lifetime Warranty</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Every piece comes with a lifetime warranty covering manufacturing defects, with complimentary resizing within 60 days.
            </p>
          </div>

        </div>
      </section>

      {/* 9. AS SEEN IN / PRESS REVIEWS */}
      <section className="border-y border-[#111111]/10 py-16 bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.25em] text-stone-500 uppercase font-medium">
              As Seen In
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs font-serif font-bold tracking-widest uppercase text-[#111111]">RUSSH MAGAZINE</span>
              <p className="text-xs text-stone-600 font-light leading-relaxed italic">
                "An innovative jewellery atelier resetting fine jewellery with precision digital configuration and photorealistic renders."
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs font-serif font-bold tracking-widest uppercase text-[#111111]">TOGETHER JOURNAL</span>
              <p className="text-xs text-stone-600 font-light leading-relaxed italic">
                "Offers more than 250,000 possible combinations across fine metals and diamonds with live pricing as you build."
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs font-serif font-bold tracking-widest uppercase text-[#111111]">MARIE CLAIRE</span>
              <p className="text-xs text-stone-600 font-light leading-relaxed italic">
                "A clever way to create something that feels genuinely personal, without the traditional fine jewellery markup."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS: "The experience, as told by you" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-[#B8935F] uppercase font-semibold block">
            Patron Testimonials
          </span>
          <h2 className="text-3xl font-serif text-[#111111] font-light">
            The experience, as told by you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: "Levi Melville",
              rating: 5,
              badge: "Verified Buyer",
              text: "Couldn’t be happier with the decision to create my partner’s ring here. The bezel eternity ring is absolutely flawless — it has blown everyone away with its brilliance."
            },
            {
              author: "Katherine El-Rassi",
              rating: 5,
              badge: "Verified Buyer",
              text: "I’m absolutely thrilled with these drop huggie earrings! From the moment I opened the box, they looked stunning — elegant, timeless, and incredibly well-crafted."
            },
            {
              author: "Claudia Hui",
              rating: 5,
              badge: "Verified Buyer",
              text: "Purchased an eternity band and stud earrings for my wedding. The craftsmanship definitely rivals name brands that charge 3x the markup. Can’t recommend enough!"
            }
          ].map((rev, i) => (
            <div key={i} className="bg-white border border-[#111111]/10 p-6 space-y-3">
              <div className="flex items-center gap-1 text-[#B8935F]">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed italic">
                "{rev.text}"
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-[#111111]">{rev.author}</span>
                <span className="text-[10px] uppercase text-emerald-600 font-medium tracking-wider">✓ {rev.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
