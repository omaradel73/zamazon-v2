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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <img src="/logo.png" alt="Zamazon" style={{ height: '32px' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zamazon</span>
            </Link>

        {/* Search */}
        <div className="search-bar" style={{ display: 'flex', flex: 1, margin: '0 3rem', maxWidth: '600px', position: 'relative' }}>
          <style>
            {`
              @media (max-width: 768px) {
                .search-bar { margin: 0 1rem !important; }
                .search-text { display: none; }
              }
            `}
          </style>
          <input 
            type="text" 
            placeholder="Search for everything..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px',
              paddingLeft: '50px',
              borderRadius: '12px', /* Updated to match widget style */
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          />
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        {/* Actions - Hidden on mobile */}
        <div className="desktop-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <style>
            {`
              @media (max-width: 768px) {
                .desktop-actions { display: none !important; }
              }
            `}
          </style>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

            {user ? (
            <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => document.getElementById('user-menu').classList.toggle('show')}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                    {user.name.charAt(0).toUpperCase()}
                </button>
                
                {/* User Dropdown Widget */}
                <div 
                    id="user-menu"
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '300px',
                        padding: '1.5rem',
                        display: 'none', // Toggled via class
                        flexDirection: 'column',
                        gap: '1rem',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 100
                    }}
                >
                     <style>{`
                        #user-menu.show { display: flex !important; }
                     `}</style>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Account</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Link to="/profile?tab=orders" style={{ textDecoration: 'none' }}>
                            <button style={{ 
                                width: '100%', padding: '12px', 
                                background: 'var(--bg-secondary)', border: 'none', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500'
                            }}>
                                <Package size={18} /> Orders
                            </button>
                        </Link>
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <button style={{ 
                                width: '100%', padding: '12px', 
                                background: 'var(--bg-secondary)', border: 'none', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500'
                            }}>
                                <User size={18} /> Profile
                            </button>
                        </Link>
                    </div>

                    {user.isAdmin && (
                         <Link to="/admin" style={{ textDecoration: 'none' }}>
                            <button style={{ 
                                width: '100%', padding: '12px', 
                                background: 'var(--bg-secondary)', border: 'none', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500'
                            }}>
                                <Package size={18} /> Admin Dashboard
                            </button>
                        </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>
                    
                    <button 
                        onClick={logout}
                        style={{ 
                            background: 'none', border: 'none', 
                            color: '#ef4444', cursor: 'pointer', 
                            textAlign: 'left', padding: '0', fontWeight: '500'
                        }}
                    >
                        Sign out
                    </button>
                </div>
            </div>
          ) : (
            <Link to="/login">
                <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <User size={24} />
                    <span style={{ marginLeft: '8px', fontWeight: '500' }}>Sign In</span>
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
    </header>
  );
};

export default Header;
