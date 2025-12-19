import toast from 'react-hot-toast';
import { Package, User as UserIcon, MapPin, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const ProfilePage = () => {
    const { user, login } = useAuth(); // login updates the local user state
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // Form State
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || '');
    const [phone, setPhone] = useState(user?.phone || '');

    useEffect(() => {
        if (activeTab === 'orders' && user) {
            fetchOrders();
        }
    }, [activeTab, user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/myorders?userId=${user.id}`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            alert("Failed to load orders");
        } finally {
            setLoading(false);
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
                    city, 
                    phone 
                })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user); // Update context
                // toast.success('Profile Updated Successfully!');
                alert(data.message || 'Profile updated successfully');
                setPassword(''); // Clear password field
            } else {
                setMsg(data.message || 'Update failed');
                // toast.error(data.message || 'Update failed');
                alert(data.message || 'Update failed');
            }
        } catch (err) {
            setMsg('Error updating profile');
            alert('Error updating profile');
        }
    };

    if (!user) return <div style={{ padding: '2rem' }}>Please log in to view profile.</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Account</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => setActiveTab('profile')}
                    style={{ 
                        padding: '10px 20px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: activeTab === 'profile' ? 'var(--primary)' : 'var(--bg-secondary)', 
                        color: activeTab === 'profile' ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    Edit Profile
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={{ 
                        padding: '10px 20px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: activeTab === 'orders' ? 'var(--primary)' : 'var(--bg-secondary)', 
                        color: activeTab === 'orders' ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    My Orders
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {activeTab === 'profile' ? (
                    <form onSubmit={handleUpdateProfile} style={{ maxWidth: '400px' }}>
                        {msg && <div style={{ marginBottom: '1rem', color: msg.includes('Success') ? 'green' : 'red' }}>{msg}</div>}
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g 010xxxxxxxx" style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address</label>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street name, Building..." style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>City</label>
                            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Cairo, Alex..." style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>New Password (leave blank to keep current)</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
                        </div>
                        
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </form>
                ) : (
                    <div>
                        {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders found.</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '10px' }}>Order ID</th>
                                        <th style={{ padding: '10px' }}>Total</th>
                                        <th style={{ padding: '10px' }}>Status</th>
                                        <th style={{ padding: '10px' }}>Date</th>
                                        <th style={{ padding: '10px' }}>Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '10px' }}>#{order._id.slice(-6)}</td>
                                            <td style={{ padding: '10px' }}>{formatCurrency(order.total)}</td>
                                            <td style={{ padding: '10px' }}>{order.status}</td>
                                            <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '10px' }}>
                                                {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
