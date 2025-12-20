import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import BottomNav from './components/BottomNav';
import Loading from './components/Loading';
import NotificationBanner from './components/NotificationBanner';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const productsRef = React.useRef(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) return <Loading />;

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ThemeProvider>
            <NotificationProvider>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NotificationBanner />
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                
                <main style={{ flex: 1, paddingBottom: '2rem' }}>
                  <Routes>
                    <Route path="/" element={
                      <>
                        {!searchQuery && <Hero scrollToProducts={scrollToProducts} />}
                        <div ref={productsRef}>
                          <ProductGrid searchQuery={searchQuery} />
                        </div>
                      </>
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <BottomNav />
                
                <footer style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  background: 'var(--bg-secondary)',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: 'auto',
                  marginBottom: '60px' // Space for BottomNav on mobile
                }}>
                  <p>&copy; 2025 Zamazon. All rights reserved.</p>
                </footer>
              </div>
            </NotificationProvider>
          </ThemeProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
