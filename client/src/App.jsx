import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Loading from './components/Loading';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const PageWrapper = ({ children }) => {
  return <div className="animate-fade-in">{children}</div>;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial asset loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Loading />;

  return (
    <NotificationProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ThemeProvider>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                
                <main style={{ flex: 1, paddingBottom: '2rem' }}>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><HomePage searchQuery={searchQuery} /></PageWrapper>} />
                    <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                    <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
                    <Route path="/verify" element={<PageWrapper><VerifyPage /></PageWrapper>} />
                    <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
                    <Route path="/reset-password" element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />
                    <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
                    <Route path="/wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <PageWrapper><ProfilePage /></PageWrapper>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <PageWrapper><AdminPage /></PageWrapper>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>

                <footer style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  background: 'var(--bg-secondary)',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: 'auto'
                }}>
                  <p>&copy; 2025 Zamazon. All rights reserved.</p>
                </footer>
              </div>
            </ThemeProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
