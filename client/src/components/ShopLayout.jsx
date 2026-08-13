import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import PromoBanner from './PromoBanner';

const ShopLayout = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PromoBanner />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main style={{ flex: 1, paddingBottom: '2rem' }}>
        <Outlet />
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
        <p>&copy; 2025 Naqsha. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ShopLayout;
