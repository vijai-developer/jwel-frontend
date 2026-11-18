import React from 'react';

export const TopAnnouncementBar = () => {
  return (
    <div className="bg-[#1F3A32] text-[#F8F3EA] border-b border-[#B89B5E]/20 text-[9px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.22em] font-medium py-2 px-3 sm:px-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <span className="opacity-90 truncate">Complimentary shipping above ₹999</span>
        <div className="hidden md:flex items-center gap-6 opacity-75 shrink-0">
          <span>• 24K Micro Gold Covering •</span>
        </div>
        <span className="hidden sm:inline opacity-90 shrink-0">Easy 7-day returns</span>
      </div>
    </div>
  );
};

