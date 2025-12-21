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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingProduct, setEditingProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [promoteEmail, setPromoteEmail] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

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
            } else if (activeTab === 'users') {
                const res = await fetch('/api/admin/users', { headers });
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            } else if (activeTab === 'products') {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
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
        if (!window.confirm("Are you sure?")) return;
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

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const form = e.target;
        const productData = {
            name: form.name.value,
            price: form.price.value,
            description: form.description.value,
            image: form.image.value
        };

        try {
            if (editingProduct) {
                await fetch(`/api/products/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to save product");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
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
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                {['orders', 'users', 'products'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '1rem 0', 
                            background: 'none', 
                            border: 'none', 
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab ? '600' : 'normal',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : activeTab === 'orders' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px' }}>Order ID</th>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>User</th>
                                <th style={{ padding: '10px' }}>Total</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr 
                                    key={order._id} 
                                    onClick={() => setSelectedOrder(order)}
                                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    className="order-row"
                                >
                                    <td data-label="Order ID" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{order._id}</td>
                                    <td data-label="Date" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td data-label="User" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        {order.userId?.name || order.user?.name || order.email || 'Guest'}
                                    </td>
                                    <td data-label="Total" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{formatCurrency(order.total || 0)}</td>
                                    <td data-label="Status" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            background: order.status === 'delivered' ? '#dcfce7' : order.status === 'declined' ? '#fee2e2' : '#ffedd5', 
                                            color: order.status === 'delivered' ? '#166534' : order.status === 'declined' ? '#991b1b' : '#9a3412',
                                            fontSize: '0.85rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td data-label="Actions" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                            style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}
                                        >
                                            Details
                                        </button>
                                        
                                        <select 
                                            value={order.status || 'pending'} 
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="declined">Declined</option>
                                        </select>

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteOrder(order._id); }}
                                            style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'products' ? (
                    <div>
                         <button 
                            className="btn-primary" 
                            style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}
                            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                         >
                            + Add Product
                         </button>
                         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '10px' }}>Image</th>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Price</th>
                                    <th style={{ padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td data-label="Image" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                            <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        </td>
                                        <td data-label="Name" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{p.name}</td>
                                        <td data-label="Price" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{formatCurrency(p.price)}</td>
                                        <td data-label="Actions" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                            <button 
                                                onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} 
                                                style={{ marginRight: '0.5rem', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(p._id)} 
                                                style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                         
                         {isProductModalOpen && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                                    <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                                    <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                        <input className="input-field" name="name" placeholder="Name" defaultValue={editingProduct?.name} required />
                                        <input className="input-field" name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} required />
                                        <textarea className="input-field" name="description" placeholder="Description" defaultValue={editingProduct?.description} />
                                        <input className="input-field" name="image" placeholder="Image URL" defaultValue={editingProduct?.image} />
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem' }}>Save</button>
                                            <button type="button" onClick={() => setIsProductModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                         )}
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Promote User to Admin</h3>
                            <form onSubmit={handlePromoteByEmail} style={{ display: 'flex', gap: '1rem' }}>
                                <input 
                                    type="email" 
                                    className="input-field"
                                    placeholder="Enter user email" 
                                    value={promoteEmail}
                                    onChange={(e) => setPromoteEmail(e.target.value)}
                                    required
                                    style={{ flex: 1 }}
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
                                    <tr key={u._id}>
                                        <td data-label="Name" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{u.name}</td>
                                        <td data-label="Email" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{u.email}</td>
                                        <td data-label="Role" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                background: u.isAdmin ? '#dbeafe' : '#f3f4f6', 
                                                color: u.isAdmin ? '#1e40af' : '#374151',
                                                fontSize: '0.85rem'
                                            }}>
                                                {u.isAdmin ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td data-label="Actions" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                            <button 
                                                onClick={() => toggleAdminRole(u._id, u.isAdmin)}
                                                style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
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
