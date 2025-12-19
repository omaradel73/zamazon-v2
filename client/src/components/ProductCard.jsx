import React, { useState } from 'react';
import { Star, Heart, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    
    // Reset animation state after 1s
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1); // Optional: reset quantity after adding
    }, 1000);
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div 
      className="glass-panel" 
      style={{ 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        animationDelay: `${index * 0.1}s` 
      }}
    >
      <div style={{ height: '220px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
          <button 
            onClick={() => toggleWishlist(product)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              padding: '8px',
              border: 'none',
              cursor: 'pointer',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            <Heart size={20} fill={isInWishlist(product.id) ? '#ef4444' : 'none'} color={isInWishlist(product.id) ? '#ef4444' : '#333'} />
          </button>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{product.name}</h3>
          <span style={{ 
            background: 'rgba(139, 92, 246, 0.2)', 
            color: '#d8b4fe', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.875rem', 
            fontWeight: 'bold'
          }}>{formatCurrency(product.price)}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
          {product.description}
        </p>
        
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', marginBottom: '1rem' }}>
            <Star size={16} fill="#fbbf24" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.rating}</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
            {/* Quantity Selector */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px', 
                padding: '4px'
            }}>
                <button onClick={decrement} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <Minus size={16} />
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                <button onClick={increment} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <Plus size={16} />
                </button>
            </div>

            {/* Add to Cart Button */}
            <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary"
                style={{ 
                    flex: 1,
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    border: 'none', 
                    cursor: isAdding ? 'default' : 'pointer', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: isAdding ? '#10b981' : '', // Green when adding
                    transition: 'all 0.3s ease'
                }}
            >
                {isAdding ? (
                    <>
                        <Check size={20} />
                        <span>Added</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart size={20} />
                        <span>Add</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
