import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Shipping State
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: 'Al Sharqia', // Default from image
    postalCode: '',
    phone: ''
  });

  const shippingCost = 85; 
  const finalTotal = totalPrice + shippingCost;
  
  // Date + 3 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleCheckout = async (e) => {
    e.preventDefault();
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

      showNotification(`Order #${data.orderId.slice(-6)} placed successfully!`, 'success');
      clearCart();
      navigate('/profile'); // Redirect to profile/orders
    } catch (err) {
      showNotification("Error placing order: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-enter checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <style>
        {`
            @media (max-width: 900px) {
                .checkout-layout { grid-template-columns: 1fr !important; }
                .order-summary { order: -1; border-left: none !important; border-bottom: 1px solid var(--border-color); }
            }
        `}
      </style>
      
      {/* Left: Information */}
      <div className="checkout-left" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 0 0 auto', width: '100%' }}>
         <div style={{ marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              <img src="/logo.png" alt="Zamazon" style={{ height: '32px' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Zamazon</span>
            </Link>
            
            <nav style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Link to="/cart" style={{ color: 'var(--primary)' }}>Cart</Link> &gt; <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Information</span> &gt; Shipping &gt; Payment
            </nav>
         </div>

         <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
             <span style={{ color: 'var(--text-secondary)' }}>Contact</span>
             <span style={{ fontWeight: '500' }}>{user?.email}</span>
             <button style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>Change</button>
         </div>

         <form onSubmit={handleCheckout}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Shipping Address</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
                <select className="input-field" style={{ width: '100%' }} defaultValue="Egypt">
                    <option>Egypt</option>
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="First name" 
                        className="input-field"
                        value={shipping.firstName}
                        onChange={e => setShipping({...shipping, firstName: e.target.value})}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Last name" 
                        className="input-field"
                        value={shipping.lastName}
                        onChange={e => setShipping({...shipping, lastName: e.target.value})}
                        required
                    />
                </div>

                <input 
                    type="text" 
                    placeholder="Address" 
                    className="input-field"
                    value={shipping.address}
                    onChange={e => setShipping({...shipping, address: e.target.value})}
                    required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="City" 
                        className="input-field"
                         // Assuming City matches Governorate in user request image logic, simplifying
                        value={shipping.city} 
                        onChange={e => setShipping({...shipping, city: e.target.value})}
                        required
                    />
                    <select 
                        className="input-field"
                        value={shipping.city}
                        onChange={e => setShipping({...shipping, city: e.target.value})}
                    >
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                        <option value="Al Sharqia">Al Sharqia</option>
                        <option value="Alexandria">Alexandria</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="Postal code (optional)" 
                        className="input-field"
                        value={shipping.postalCode}
                        onChange={e => setShipping({...shipping, postalCode: e.target.value})}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder="Phone" 
                        className="input-field"
                        value={shipping.phone}
                        onChange={e => setShipping({...shipping, phone: e.target.value})}
                        required
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>?</span>
                </div>

                <h2 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0' }}>Shipping Method</h2>
                <div style={{ padding: '1rem', border: '1px solid var(--primary)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Standard</span>
                    <span style={{ fontWeight: 'bold' }}>{formatCurrency(shippingCost)}</span>
                </div>

                <h2 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    Payment
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    All transactions are secure and encrypted.
                </p>
                
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                        <input type="radio" checked readOnly />
                        <label style={{ fontWeight: '500' }}>Cash on Delivery (COD)</label>
                    </div>
                </div>

                <button 
                  type="submit"
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1.2rem', marginTop: '1.5rem', fontSize: '1.1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link to="/cart" style={{ color: 'var(--primary)', textDecoration: 'none' }}>&lt; Return to cart</Link>
                </div>

            </div>
         </form>
      </div>

      {/* Right: Summary */}
      <div className="order-summary" style={{ background: '#f5f5f5', borderLeft: '1px solid var(--border-color)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '450px', width: '100%' }}>
            {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
                        <span style={{ 
                            position: 'absolute', top: '-10px', right: '-10px', 
                            background: 'rgba(113, 113, 122, 0.9)', color: 'white', 
                            borderRadius: '50%', width: '20px', height: '20px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' 
                        }}>
                            {item.quantity}
                        </span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: '#333' }}>{item.name}</div>
                        {/* <div style={{ fontSize: '0.85rem', color: '#666' }}>S / Black</div> */}
                    </div>
                    <div style={{ fontWeight: '500', color: '#333' }}>{formatCurrency(item.price * item.quantity)}</div>
                </div>
            ))}

            <div style={{ borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', margin: '2rem 0', padding: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#555' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#333', fontWeight: '500' }}>{formatCurrency(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#333', fontWeight: '500' }}>{formatCurrency(shippingCost)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', color: '#333' }}>Total</span>
                <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666', marginBottom: '4px' }}>EGP</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{formatCurrency(finalTotal).replace('EGP', '').trim()}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
