import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Loading from './components/Loading';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Ref to scroll to products
  const productsRef = React.useRef(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Simulate initial asset loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) return <Loading />;

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ThemeProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              
              <main style={{ flex: 1, paddingBottom: '2rem' }}>
                <Routes>
                  <Route path="/" element={
                    <>
                      {/* Hide Hero when searching */}
                      {!searchQuery && <Hero scrollToProducts={scrollToProducts} />}
                      
                      <div ref={productsRef}>
                        <ProductGrid searchQuery={searchQuery} />
                      </div>
                    </>
                  } />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>

              <footer style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
                marginTop: 'auto'
              }}>
                <p>&copy; 2024 Zamazon. All rights reserved.</p>
              </footer>
            </div>
          </ThemeProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
