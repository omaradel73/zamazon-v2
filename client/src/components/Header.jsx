import React, { useState } from 'react';
import { ShoppingCart, Search, User, Sun, Moon, Package, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        {/* Mobile Menu Button */}
        <button 
            className="mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ 
                background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginRight: '1rem',
                display: window.innerWidth > 768 ? 'none' : 'block' // Simple check, CSS media query is better but inline for now
            }}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem', marginRight: 'auto' }}>
            <img src="/logo.png" alt="Zamazon" style={{ height: '40px' }} />
            <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '-1px' }}>amazon</span>
        </Link>
        <style>{`
            @media (max-width: 768px) {
                .logo-text { display: none; } /* Hide text on small mobile */
                .mobile-only { display: block !important; }
                .desktop-actions { display: none !important; }
            }
            @media (min-width: 769px) {
                .mobile-only { display: none !important; }
            }
        `}</style>


        {/* Search */}
        <div className="search-bar" style={{ display: 'flex', flex: 1, margin: '0 1rem', maxWidth: '600px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 20px 10px 45px',
              borderRadius: '99px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '16px' // Prevent Zoom
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        {/* Desktop Actions */}
        <div className="desktop-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

            {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user.isAdmin && (
                    <Link to="/admin" title="Admin Dashboard">
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <Package size={24} />
                        </button>
                    </Link>
                )}
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{user.name}</span>
                </Link>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login">
                <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><User size={24} /></button>
            </Link>
          )}
          
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', position: 'relative' }}>
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
                )}
            </button>
          </Link>
        </div>

        {/* Mobile Cart Icon (Always Visible) */}
        <Link to="/cart" className="mobile-only" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', position: 'relative' }}>
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
                )}
            </button>
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {user ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold' }}>{user.name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                        </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem' }}>My Profile</Link>
                    {user.isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem' }}>Admin Dashboard</Link>}
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '1.2rem', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                </>
            ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>Login / Register</Link>
            )}
            
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Theme</span>
                <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
