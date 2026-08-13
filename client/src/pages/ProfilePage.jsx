import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import { User, Package, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { user, login, logout } = useAuth(); // login updates the local user state
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    // Internal state for orders/form
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [msg, setMsg] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAddress(user.address || '');
            setRegion(user.region || '');
            setCity(user.city || '');
            setPostalCode(user.postalCode || '');
            setPhone(user.phone || '');
        }
    }, [user]);



    useEffect(() => {
        if (activeTab === 'orders' && user) {
            fetchOrders();
        }
    }, [activeTab, user]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`/api/orders/myorders?userId=${user.id}`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    password,
                    address,
                    region,
                    city,
                    phone
                })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user); // Update context
                setMsg('Profile Updated Successfully!');
                setPassword(''); // Clear password field
            } else {
                setMsg(data.message || 'Update failed');
            }
        } catch (err) {
            setMsg('Error updating profile');
        }
    };

    if (!user) return <div style={{ padding: '2rem' }}>{t('pleaseLoginToViewProfile')}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>

            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
                <style>{`
                    @media(max-width: 768px) {
                        .profile-layout { grid-template-columns: 1fr !important; }
                    }
                `}</style>

                {/* Sidebar Navigation */}
                <div className="glass-panel" style={{ height: 'fit-content', padding: '1rem' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600' }}>{user.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setSearchParams({ tab: 'profile' })}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px',
                                background: activeTab === 'profile' ? 'var(--bg-primary)' : 'transparent',
                                border: activeTab === 'profile' ? '1px solid var(--border-color)' : 'none',
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'profile' ? '600' : '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <User size={20} /> {t('editProfile')}
                        </button>
                        <button
                            onClick={() => setSearchParams({ tab: 'orders' })}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px',
                                background: activeTab === 'orders' ? 'var(--bg-primary)' : 'transparent',
                                border: activeTab === 'orders' ? '1px solid var(--border-color)' : 'none',
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'orders' ? '600' : '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Package size={20} /> {t('myOrders')}
                        </button>
                        <button
                            onClick={logout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px',
                                background: 'transparent', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', textAlign: 'left', color: '#ef4444', fontWeight: '500', marginTop: '1rem'
                            }}
                        >
                            <LogOut size={20} /> {t('signOut')}
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    {activeTab === 'profile' ? (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem' }}>{t('editProfile')}</h2>
                            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
                                {msg && (
                                    <div style={{
                                        padding: '1rem', borderRadius: '8px',
                                        background: msg.includes('Success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: msg.includes('Success') ? '#10b981' : '#ef4444'
                                    }}>
                                        {msg}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={phone}
                                            onChange={e => {
                                                if (e.target.value.startsWith('+20 ')) {
                                                    setPhone(e.target.value)
                                                } else if (e.target.value === '+20') {
                                                    setPhone('+20 ')
                                                }
                                            }}
                                            placeholder="+20 1xxxxxxxxx"
                                        />
                                        <img src="https://flagcdn.com/w40/eg.png" alt="Egypt" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '24px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>City</label>
                                    <select
                                        className="input-field"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                    >
                                        <option value="" disabled>Select City</option>
                                        {[
                                            "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
                                            "Gharbiya", "Ismailia", "Monufia", "Minya", "Qaliubiya", "New Valley",
                                            "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta",
                                            "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor",
                                            "Qena", "North Sinai", "Sohag"
                                        ].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>Postal Code</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={postalCode}
                                        onChange={e => setPostalCode(e.target.value)}
                                        placeholder="Optional"
                                    />
                                </div>


                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>Address</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        placeholder="Street name, Building..."
                                    />
                                </div>

                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>Region / District</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={region}
                                        onChange={e => setRegion(e.target.value)}
                                        placeholder="Region / Area"
                                    />
                                </div>

                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '500' }}>New Password</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <button type="submit" className="btn-primary" style={{ padding: '12px 2rem' }}>
                                        {t('saveChanges')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem' }}>{t('myOrders')}</h2>
                            {loadingOrders ? <p>Loading orders...</p> : orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>{t('noOrders')}</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {orders.map(order => (
                                        <div key={order._id} className="order-card" style={{
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            padding: '1.5rem',
                                            background: 'var(--bg-primary)'
                                        }}>
                                            <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                                <div>
                                                    <span style={{ fontWeight: 'bold' }}>{t('order')} #{order._id.slice(-6)}</span>
                                                    <span style={{ margin: '0 10px', color: 'var(--text-secondary)' }}>•</span>
                                                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                                    {formatCurrency(order.total)}
                                                </div>
                                            </div>

                                            <div className="order-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                                            <span style={{ fontSize: '0.9rem' }}>{item.quantity}x {item.name}</span>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && <span style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>+{order.items.length - 3} {t('more')}</span>}
                                                </div>
                                                <div style={{
                                                    padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '600',
                                                    background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: order.status === 'Delivered' ? '#10b981' : '#f59e0b'
                                                }}>
                                                    {order.status || 'Processing'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
