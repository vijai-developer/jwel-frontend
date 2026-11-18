import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/CartContext';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export const ProtectedAdminRoute = ({ children, fallback = null }) => {
  const { isAdminAuthenticated, setIsAdminLoginOpen } = useAuth();
  const { setCurrentView } = useShop();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
    }
  }, [isAdminAuthenticated, setIsAdminLoginOpen]);

  if (!isAdminAuthenticated) {
    return fallback || (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
        <div className="bg-white border border-[#E8DFD1] p-8 sm:p-10 rounded-3xl max-w-md shadow-lg space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#E5C992] flex items-center justify-center mx-auto shadow-md border border-[#C5A059]/40">
            <ShieldAlert className="w-7 h-7 text-[#C5A059]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-serif font-bold text-[#111111]">Protected Administrative Area</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              This management sector is restricted to authorized personnel. Verification with your administrative security passcode is required.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button 
              onClick={() => setIsAdminLoginOpen(true)}
              className="w-full py-3 bg-[#111111] text-[#E5C992] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#C5A059]" />
              <span>Verify Admin Passcode</span>
            </button>
            <button 
              onClick={() => {
                setCurrentView('home');
                navigate('/');
              }}
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
