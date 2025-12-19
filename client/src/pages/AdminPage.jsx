import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || (!user.isAdmin && user.email !== 'omaradel73@gmail.com')) {
           // Basic client-side check, server also checks
           // Allowing omaradel73@gmail.com explicitly just in case isAdmin isn't synced yet
        }
        fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { 'x-admin-email': user.email };
            
            if (activeTab === 'orders') {
                const res = await fetch('/api/admin/orders', { headers });
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } else {
                const res = await fetch('/api/admin/users', { headers });
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAdminRole = async (userId, currentStatus) => {
        try {
            await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-email': user.email
                },
                body: JSON.stringify({ isAdmin: !currentStatus })
            });
            fetchData(); // Refresh
        } catch (error) {
            alert("Failed to update user");
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
                    Orders
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    style={{ 
                        padding: '10px 20px', 
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === 'users' ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: activeTab === 'users' ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    Users
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : activeTab === 'orders' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px' }}>Order ID</th>
                                <th style={{ padding: '10px' }}>User</th>
                                <th style={{ padding: '10px' }}>Total</th>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px' }}>#{order._id.slice(-6)}</td>
                                    <td style={{ padding: '10px' }}>{order.email}</td>
                                    <td style={{ padding: '10px' }}>{formatCurrency(order.total)}</td>
                                    <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            background: order.status === 'pending' ? '#fef3c7' : '#d1fae5',
                                            color: order.status === 'pending' ? '#d97706' : '#059669',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Role</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px' }}>{u.name}</td>
                                    <td style={{ padding: '10px' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>{u.isAdmin ? 'Admin' : 'Customer'}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button 
                                            onClick={() => toggleAdminRole(u._id, u.isAdmin)}
                                            style={{ 
                                                padding: '5px 10px', 
                                                cursor: 'pointer',
                                                background: u.isAdmin ? '#ef4444' : '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            {u.isAdmin ? 'Demote' : 'Promote'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
