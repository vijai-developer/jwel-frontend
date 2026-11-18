import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useShop } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { CustomerOrderTracker } from './components/CustomerOrderTracker';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { AdminLoginModal } from './components/AdminLoginModal';

import { Storefront } from './pages/Storefront';
import { ProductCatalog } from './pages/ProductCatalog';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Login } from './pages/Login';
import { AccountPage } from './pages/AccountPage';

import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Orders } from './pages/admin/Orders';
import { Customers } from './pages/admin/Customers';

import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Crown, 
  Sparkles 
} from 'lucide-react';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { HomeNew } from './pages/HomeNew';

const MainAppContent = () => {
  const { currentView = '', setCurrentView, toast } = useShop();
  const { isAdminAuthenticated, setIsAdminLoginOpen } = useAuth();
  const location = useLocation();

  const isAdminView = (currentView && currentView.startsWith('admin')) || (location && location.pathname.startsWith('/admin'));

  React.useEffect(() => {
    if (isAdminView && !isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
    }
  }, [isAdminView, isAdminAuthenticated, setIsAdminLoginOpen]);

  const isEditorialHome = location.pathname === '/' || location.pathname === '/home-new';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#111111]">
      {/* Scroll To Top on Route/Category Transition */}
      <ScrollToTop />

      {/* Top Navbar (Hidden on Editorial Home to avoid duplicate navigation) */}
      {!isEditorialHome && <Navbar />}

      {/* Admin Sub-Header */}
      {isAdminView && isAdminAuthenticated && (
        <div className="bg-[#FAF0E4] border-b border-[#E8DFD1] py-2 px-3 sm:px-4 sticky top-0 sm:top-[76px] md:top-[108px] z-30 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center justify-between sm:justify-start gap-2 font-bold text-[#8C6D31] text-[11px] sm:text-xs whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#C5A059]" />
                <span>ADMIN MANAGEMENT PORTAL</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0 py-0.5">
              {[
                { id: 'admin-overview', label: 'Store Analytics', icon: LayoutDashboard },
                { id: 'admin-products', label: 'Inventory & Products', icon: Package },
                { id: 'admin-orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
                { id: 'admin-customers', label: 'Customer Directory', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap text-[11px] sm:text-xs flex-shrink-0 cursor-pointer ${
                    currentView === tab.id 
                      ? 'bg-[#C5A059] text-white font-bold shadow-xs' 
                      : 'text-gray-700 hover:bg-white hover:text-[#C5A059]'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* React Router SPA Navigation */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeNew />} />
          <Route path="/home-new" element={<HomeNew />} />
          <Route path="/home-classic" element={<Storefront />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/collections" element={<ProductCatalog />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/wishlist" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product-detail" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/my-orders" element={<AccountPage />} />
          <Route path="/tryon" element={<VirtualTryOnModal />} />
          <Route path="/virtual-mirror" element={<VirtualTryOnModal />} />
          <Route path="/tracker" element={<CustomerOrderTracker />} />
          <Route path="/track-order" element={<CustomerOrderTracker />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Dashboard />
              </div>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/overview" element={
            <ProtectedAdminRoute>
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Dashboard />
              </div>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedAdminRoute>
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Products />
              </div>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedAdminRoute>
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Orders />
              </div>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedAdminRoute>
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Customers />
              </div>
            </ProtectedAdminRoute>
          } />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <InvoiceModal />
      <AdminLoginModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white border border-[#E5C992]/40 px-4 py-3 shadow-2xl flex items-center gap-2.5 text-xs font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-[#E5C992]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Footer (Hidden on Editorial Home to avoid duplicate navigation) */}
      {!isAdminView && !isEditorialHome && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <MainAppContent />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
