import React from 'react';
import { ShoppingCart, Search, User, Sun, Moon, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      backgroundColor: 'var(--glass-bg)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'background-color 0.3s'
    }}>
      <div className="container header-container" style={{ padding: '10px 1rem' }}>
        <style>
          {`
            .header-container {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 1rem;
            }
            .search-bar-container {
               flex: 1;
               margin: 0 2rem;
               max-width: 600px;
               min-width: 200px;
            }
            @media (max-width: 768px) {
              .header-container {
                flex-direction: column;
                align-items: stretch;
                padding-bottom: 1rem !important;
              }
              .search-bar-container {
                margin: 0 !important;
                order: 3; /* Move search to bottom on mobile */
                width: 100%;
                max-width: none;
              }
              .logo-actions-wrapper {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
              }
            }
          `}
        </style>
        
        {/* Mobile Wrapper for Logo and Actions to keep them on top line */}
        <div className="logo-actions-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: 'auto' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}>
                <img src="/logo.svg" alt="Zamazon" style={{ height: '35px' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '-1px' }}>amazon</span>
            </Link>

            {/* Actions (Moved inside wrapper for mobile layout) */}
            <div className="mobile-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {user.isAdmin && (
                            <Link to="/admin" title="Admin Dashboard">
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                                    <Package size={24} />
                                </button>
                            </Link>
                        )}
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <span style={{ fontWeight: '600', color: 'var(--primary)', display: 'none' }} className="desktop-only-text">Hi, {user.name}</span>
                            <User size={24} style={{ display: 'block' }} className="mobile-only-icon" /> 
                        </Link>
                        <button 
                            onClick={logout}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <User size={24} />
                        </button>
                    </Link>
                )}
                
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', position: 'relative' }}>
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: 'var(--primary)',
                            color: 'white',
                            fontSize: '0.7rem',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>{totalItems}</span>
                        )}
                    </button>
                </Link>
            </div>
        </div>

        {/* Search */}
        <div className="search-bar-container" style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for everything..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 50px',
              borderRadius: '99px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
