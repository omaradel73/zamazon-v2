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

    const [promoteEmail, setPromoteEmail] = useState('');

    useEffect(() => {
        if (!user || (!user.isAdmin && user.email !== 'omaradel73@gmail.com')) {
           // Basic check
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
            fetchData();
        } catch (error) {
            alert("Failed to update user");
        }
    };

    const handlePromoteByEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users/promote', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-email': user.email
                },
                body: JSON.stringify({ email: promoteEmail })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setPromoteEmail('');
                fetchData();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Failed to promote user");
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-email': user.email
                },
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const deleteOrder = async (orderId) => {
        if (!confirm("Are you sure you want to delete this order?")) return;
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'x-admin-email': user.email }
            });
            fetchData();
        } catch (err) {
            alert("Failed to delete order");
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px' }}>#{order._id.slice(-6)}</td>
                                    <td style={{ padding: '10px' }}>
                                        <div>{order.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px' }}>{formatCurrency(order.total)}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            background: order.status === 'pending' ? '#fef3c7' : 
                                                       order.status === 'shipped' ? '#bae6fd' :
                                                       order.status === 'delivered' ? '#d1fae5' : '#fee2e2',
                                            color: order.status === 'pending' ? '#d97706' : 
                                                   order.status === 'shipped' ? '#0284c7' :
                                                   order.status === 'delivered' ? '#059669' : '#b91c1c',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                        <button 
                                            onClick={() => deleteOrder(order._id)}
                                            style={{ 
                                                padding: '5px 10px', 
                                                background: '#ef4444', 
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Promote User to Admin</h3>
                            <form onSubmit={handlePromoteByEmail} style={{ display: 'flex', gap: '1rem' }}>
                                <input 
                                    type="email" 
                                    placeholder="Enter user email" 
                                    value={promoteEmail}
                                    onChange={(e) => setPromoteEmail(e.target.value)}
                                    required
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                />
                                <button type="submit" className="btn-primary">Promote</button>
                            </form>
                        </div>

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
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
