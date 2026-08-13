import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

import logo from '../assets/naqsha-logo.jpg';

const CheckoutPage = () => {
    const { cart, clearCart, totalPrice } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Shipping State
    const [shipping, setShipping] = useState({
        firstName: '',
        lastName: '',
        address: '',
        region: '',
        city: 'Cairo',
        postalCode: '',
        phone: '+20 '
    });

    // Sync Profile to Shipping
    useEffect(() => {
        if (user) {
            const names = (user.name || '').split(' ');
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            setShipping(prev => ({
                ...prev,
                firstName: firstName,
                lastName: lastName,
                address: user.address || '',
                region: user.region || '',
                city: user.city || 'Cairo',
                postalCode: user.postalCode || '',
                phone: user.phone || '+20 '
            }));
        }
    }, [user]);

    const governorates = [
        "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
        "Gharbiya", "Ismailia", "Monufia", "Minya", "Qaliubiya", "New Valley",
        "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta",
        "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor",
        "Qena", "North Sinai", "Sohag"
    ];

    // Dynamic Shipping Cost
    let shippingCost = (shipping.city === 'Cairo' || shipping.city === 'Giza') ? 70 : 80;

    // Free Shipping Logic
    if (totalPrice >= 1000) {
        shippingCost = 0;
    }

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
            {/* Header handled in CSS */}

            {/* Left: Information */}
            <div className="checkout-left" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 0 0 auto', width: '100%' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        <img src={logo} alt="Naqsha" style={{ height: '32px', borderRadius: '8px' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Naqsha</span>
                    </Link>

                    <nav style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Link to="/cart" style={{ color: 'var(--primary)' }}>{t('cart')}</Link> &gt; <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Information</span> &gt; {t('shipping')} &gt; {t('payment')}
                    </nav>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('contact')}</span>
                    <span style={{ fontWeight: '500' }}>{user?.email}</span>
                </div>

                <form onSubmit={handleCheckout}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('shippingAddress')}</h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <select className="input-field" style={{ width: '100%' }} defaultValue="Egypt">
                            <option>Egypt</option>
                        </select>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder={t('firstName')}
                                className="input-field"
                                value={shipping.firstName}
                                onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder={t('lastName')}
                                className="input-field"
                                value={shipping.lastName}
                                onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder={t('address')}
                                className="input-field"
                                value={shipping.address}
                                onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder={t('region')}
                                className="input-field"
                                value={shipping.region}
                                onChange={e => setShipping({ ...shipping, region: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <select
                                className="input-field"
                                value={shipping.city}
                                onChange={e => setShipping({ ...shipping, city: e.target.value })}
                            >
                                {governorates.map(gov => (
                                    <option key={gov} value={gov}>{gov}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Postal code (optional)"
                                className="input-field"
                                value={shipping.postalCode}
                                onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                                style={{ direction: 'ltr', textAlign: 'left', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder={t('phone')}
                                className="input-field"
                                value={shipping.phone}
                                onChange={e => {
                                    // Prevent deleting prefix
                                    if (e.target.value.startsWith('+20 ')) {
                                        setShipping({ ...shipping, phone: e.target.value })
                                    } else if (e.target.value === '+20') {
                                        setShipping({ ...shipping, phone: '+20 ' })
                                    }
                                }}
                                required
                                style={{ direction: 'ltr', textAlign: 'left', paddingRight: '40px', color: 'var(--text-primary)' }}
                            />
                            <img src="https://flagcdn.com/w40/eg.png" alt="Egypt Flag" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '24px', borderRadius: '2px' }} />
                        </div>

                        <h2 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0' }}>{t('shippingMethod')}</h2>
                        <div style={{ padding: '1rem', border: '1px solid var(--primary)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('standard')}</span>
                            <span style={{ fontWeight: 'bold', color: shippingCost === 0 ? '#10B981' : 'inherit' }}>
                                {shippingCost === 0 ? t('free') : formatCurrency(shippingCost)}
                            </span>
                        </div>

                        <h2 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                            {t('payment')}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            All transactions are secure and encrypted.
                        </p>

                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem', display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                <input type="radio" checked readOnly />
                                <label style={{ fontWeight: '500' }}>{t('cod')}</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.2rem', marginTop: '1.5rem', fontSize: '1.1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : t('completeOrder')}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <Link to="/cart" style={{ color: 'var(--primary)', textDecoration: 'none' }}>&lt; {t('returnToCart')}</Link>
                        </div>

                    </div>
                </form>
            </div>

            {/* Right: Summary */}
            <div className="order-summary">
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
                                <div className="summary-text" style={{ fontWeight: '500' }}>{item.name}</div>
                            </div>
                            <div className="summary-text" style={{ fontWeight: '500' }}>{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '2rem 0', padding: '1.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }} className="summary-subtext">
                            <span>{t('subtotal')}</span>
                            <span className="summary-text" style={{ fontWeight: '500' }}>{formatCurrency(totalPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="summary-subtext">
                            <span>{t('shipping')}</span>
                            <span className="summary-text" style={{ fontWeight: '500', color: shippingCost === 0 ? '#10B981' : 'inherit' }}>
                                {shippingCost === 0 ? t('free') : formatCurrency(shippingCost)}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="summary-text" style={{ fontSize: '1.2rem' }}>{t('total')}</span>
                        <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                            <span className="summary-subtext" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>EGP</span>
                            <span className="summary-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(finalTotal).replace('EGP', '').trim()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
