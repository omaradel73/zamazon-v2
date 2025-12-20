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

    const [selectedOrder, setSelectedOrder] = useState(null);

    // ... (existing helper functions)

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
            {/* Modal for Order Details */}
            {selectedOrder && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
                }}>
                    <div className="glass-panel" style={{ background: 'var(--bg-primary)', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>&times;</button>
                        </div>
                        
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Order Info</div>
                                <p><b>ID:</b> #{selectedOrder._id}</p>
                                <p><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                <p><b>Status:</b> <span style={{ textTransform: 'capitalize' }}>{selectedOrder.status}</span></p>
                                <p><b>Total:</b> {formatCurrency(selectedOrder.total)}</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Customer & Shipping</div>
                                <p><b>Customer Email:</b> {selectedOrder.email}</p>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <p><b>Address:</b> {selectedOrder.shipping?.address}</p>
                                    <p><b>City:</b> {selectedOrder.shipping?.city}</p>
                                    <p><b>Postal:</b> {selectedOrder.shipping?.postalCode || 'N/A'}</p>
                                    <p><b>Phone:</b> {selectedOrder.shipping?.phone}</p>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Items ({selectedOrder.items?.length})</div>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', padding: '10px', gap: '10px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>x{item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: '500' }}>{formatCurrency(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                            <button className="btn-primary" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <td style={{ padding: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            style={{ 
                                                padding: '5px 10px', 
                                                background: 'var(--bg-secondary)', 
                                                color: 'var(--text-primary)', 
                                                border: '1px solid var(--border-color)', 
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Details
                                        </button>
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
