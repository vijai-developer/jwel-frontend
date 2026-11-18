import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/CartContext';

export const EditorialFooter = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useShop();

  const handleNav = (cat) => {
    setSelectedCategory(cat);
    navigate('/catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#F8F3EA] text-[#1E1E1E] pt-16 sm:pt-20 pb-12 px-4 sm:px-12 border-t border-[#B89B5E]/30 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Four Calm Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 pb-16">
          
          {/* Col 1: About Brand */}
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.12em] uppercase text-[#1F3A32] mb-3 font-normal">
              Sushma Jewels
            </span>
            <p className="text-xs text-gray-600 leading-relaxed font-light mb-6 max-w-xs">
              Meticulously handcrafted 24K micro-gold covering and lab-diamond fine jewellery. Created with generational reverence, designed for modern elegance.
            </p>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89B5E] font-medium">
              1-Year Plating Guarantee On All Pieces
            </span>
          </div>

          {/* Col 2: Shop Directory */}
          <div className="flex flex-col">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#1F3A32] font-semibold mb-5">
              The Collections
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-600 font-light tracking-wide">
              <li>
                <button onClick={() => handleNav('Necklaces')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Necklaces & Royal Harams
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('Earrings')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Earrings & Temple Jhumkas
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('Bracelets')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Bangles & Screw-open Kadas
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('Rings')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Solitaires & Eternity Rings
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('Collections')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Bridal Kundan Edit
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="flex flex-col">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#1F3A32] font-semibold mb-5">
              Concierge Care
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-600 font-light tracking-wide">
              <li>
                <button onClick={() => navigate('/tracker')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Track Consignment
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tryon')} className="hover:text-[#B89B5E] transition-colors text-left">
                  Virtual Atelier Mirror
                </button>
              </li>
              <li>
                <a href="#craft" className="hover:text-[#B89B5E] transition-colors">
                  Care & Re-Polishing Guide
                </a>
              </li>
              <li>
                <span className="text-gray-500">
                  Complimentary Insured Delivery
                </span>
              </li>
              <li>
                <span className="text-gray-500">
                  7-Day Velvet Exchange Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Flagship Address */}
          <div className="flex flex-col">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#1F3A32] font-semibold mb-5">
              Private Client Salon
            </h4>
            <address className="not-italic text-xs text-gray-600 leading-relaxed font-light flex flex-col gap-2">
              <p>Road No. 36, Jubilee Hills</p>
              <p>Hyderabad, Telangana 500033</p>
              <p className="pt-2 text-[#1F3A32] font-medium">concierge@sushmajewels.com</p>
              <p className="text-gray-500">+91 (040) 2345 6789</p>
            </address>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6 text-xs uppercase tracking-[0.2em] text-[#B89B5E]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
              <span>•</span>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Pinterest</a>
            </div>
          </div>

        </div>

        {/* Thin Gold Divider Line */}
        <div className="w-full h-px bg-[#B89B5E]/30 mb-8" />

        {/* Bottom Bar: Copyright & Payment Notes */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-light tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Sushma Jewels. All rights reserved.</p>
          <div className="flex items-center gap-6 uppercase text-[10px] text-gray-400">
            <span>UPI</span>
            <span>•</span>
            <span>Visa & Mastercard</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

