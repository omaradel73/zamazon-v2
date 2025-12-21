import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  
  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={{ padding: '4rem 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Cart <span style={{ fontSize: '1rem', background: '#e5e7eb', padding: '2px 8px', borderRadius: '50%', color: '#333', verticalAlign: 'middle' }}>{cart.length}</span></h2>
      
      <div className="cart-layout" style={{ alignItems: 'start' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cart.map(item => (
              <div key={item._id} className="cart-item" style={{ display: 'flex', gap: '2rem', alignItems: 'start', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                <img src={item.image} alt={item.name} style={{ width: '120px', height: '150px', objectFit: 'cover' }} />
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>{item.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>M</p> {/* Placeholder size */}
                        <div style={{ color: 'var(--text-secondary)' }}>{formatCurrency(item.price)}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                         {/* Quantity Control */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', height: '40px' }}>
                            <button 
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                style={{ background: 'none', border: 'none', padding: '0 15px', cursor: 'pointer', color: 'var(--text-primary)', height: '100%', fontSize: '1.2rem' }}
                            >−</button>
                            <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                style={{ background: 'none', border: 'none', padding: '0 15px', cursor: 'pointer', color: 'var(--text-primary)', height: '100%', fontSize: '1.2rem' }}
                            >+</button>
                        </div>
                        
                        <button 
                            onClick={() => removeFromCart(item._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div style={{ fontWeight: '500', minWidth: '100px', textAlign: 'right' }}>
                        {formatCurrency(item.price * item.quantity)}
                    </div>
                </div>
              </div>
            ))}
        </div>

        {/* Summary Card */}
        <div className="cart-summary" style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }}>
            {/* Discount section removed */}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '500' }}>{formatCurrency(totalPrice)}</span>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Taxes and shipping calculated at checkout.
            </p>

            <button 
                className="btn-black" 
                onClick={() => navigate('/checkout')}
            >
                Check out
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
