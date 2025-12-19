import React from 'react';
import { ShoppingCart, Search, User, Sun, Moon } from 'lucide-react';
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
        <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Zamazon" style={{ height: '40px' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-1px', color: 'var(--text-primary)' }}>Zamazon</span>
            </div>
        </Link>

        {/* Search */}
        <div style={{ display: 'flex', flex: 1, margin: '0 3rem', maxWidth: '600px', position: 'relative' }}>
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

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Hi, {user.name}</span>
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
    </header>
  );
};

export default Header;
