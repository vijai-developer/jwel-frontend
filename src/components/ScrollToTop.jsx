import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/CartContext';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { selectedCategory } = useShop();

  useEffect(() => {
    // Reset window scroll position to top on route or category change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, selectedCategory]);

  return null;
};

export default ScrollToTop;
