import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { Trash2, ShoppingCart } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Save items you like to buy later!</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h2 style={{ marginBottom: '2rem' }}>My Wishlist ({wishlist.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {wishlist.map(product => (
          <div key={product.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
              <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>{formatCurrency(product.price)}</p>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Add
                </button>
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)', 
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
