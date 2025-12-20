import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Shipping State
  const [shipping, setShipping] = useState({
    address: '',
    city: 'Cairo',
    phone: ''
  });

  const shippingCost = 50; // Flat rate EGP
  const finalTotal = totalPrice + shippingCost;
  
  // Date + 3 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!shipping.address || !shipping.phone) {
        showNotification("Please fill in your shipping details.", "error");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          items: cart,
          total: finalTotal,
          shipping: shipping,
          deliveryDate: formattedDate
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(`Order placed! Verification email sent to ${user.email}.`);
      clearCart();
    } catch (err) {
      setMessage("Error placing order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={{ padding: '4rem 0' }}>
      <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
      
      {message ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
          <h3>{message}</h3>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>We have sent a verification email.</p>
        </div>
      ) : (
        <div className="responsive-grid cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Cart Items */}
            {cart.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >-</button>
                        <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >+</button>
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>{formatCurrency(item.price * item.quantity)}</div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            {/* Shipping Form */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Shipping Details</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Address (Street, Building)" 
                        className="input-field"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        value={shipping.address}
                        onChange={e => setShipping({...shipping, address: e.target.value})}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <select 
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            value={shipping.city}
                            onChange={e => setShipping({...shipping, city: e.target.value})}
                        >
                            <option value="Cairo">Cairo</option>
                            <option value="Giza">Giza</option>
                            <option value="Alexandria">Alexandria</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            className="input-field"
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            value={shipping.phone}
                            onChange={e => setShipping({...shipping, phone: e.target.value})}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Checkout Box */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1rem' }}>
              <span>Shipping</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>

            <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981', fontSize: '0.9rem' }}>
                Est. Delivery: <b>{formattedDate}</b>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Checkout Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
