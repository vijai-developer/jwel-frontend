import React, { useState, useEffect } from 'react';

export const EditorialReviews = () => {
  const reviews = [
    {
      id: 1,
      quote: "The Kundan Choker felt indistinguishable from our family heirlooms. The micro-gold finish held its radiant warmth through two days of wedding ceremonies.",
      author: "Radhika Sharma",
      city: "Mumbai",
      occasion: "Bridal Rehearsal"
    },
    {
      id: 2,
      quote: "The Bezel Eternity Ring is a masterpiece of precision. The diamonds possess extraordinary fire, and the flush setting makes it effortless for everyday wear.",
      author: "Ananya Reddy",
      city: "Hyderabad",
      occasion: "Anniversary Edition"
    },
    {
      id: 3,
      quote: "Finding high-grade imitation temple jewellery that doesn't irritate sensitive skin was once impossible. Sushma Jewels has redefined conscious luxury for me.",
      author: "Pooja Deshmukh",
      city: "Bangalore",
      occasion: "Festive Collection"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-fading every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const activeReview = reviews[currentIndex];

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-12 bg-[#F8F3EA] text-[#1E1E1E] border-t border-[#B89B5E]/20 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-xs font-serif italic text-[#B89B5E] tracking-widest text-lg">
            06
          </span>
          <div className="h-px w-8 bg-[#B89B5E]/40" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
            Voices of Adornment
          </span>
        </div>

        {/* Large Centered Testimonial in Elegant Italic Serif */}
        <div className="min-h-[180px] sm:min-h-[160px] flex flex-col justify-center transition-opacity duration-700 ease-in-out">
          <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#1F3A32] font-light leading-relaxed tracking-[0.01em] mb-8">
            “{activeReview.quote}”
          </blockquote>

          {/* Small Name, Stars, and City Line */}
          <div className="flex flex-col items-center gap-2">
            {/* 5 Subtle Gold Stars */}
            <div className="flex items-center gap-1 text-[#B89B5E] text-xs">
              {'★★★★★'}
            </div>

            <p className="text-xs uppercase tracking-[0.22em] text-[#1E1E1E] font-medium">
              {activeReview.author} • <span className="text-gray-500 font-light">{activeReview.city}</span>
            </p>

            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89B5E] font-light">
              {activeReview.occasion}
            </span>
          </div>
        </div>

        {/* Small Dot Controls */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-6 h-1 bg-[#B89B5E]'
                  : 'w-1.5 h-1.5 bg-[#B89B5E]/30 hover:bg-[#B89B5E]/60'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

