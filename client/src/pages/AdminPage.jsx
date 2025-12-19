import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Package } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '' });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
        await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        fetchProducts(); // Refresh
    } catch (err) {
        alert("Failed to delete");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setFormData({ name: '', price: '', description: '', image: '' });
        fetchProducts();
    } catch (err) {
        alert("Failed to add");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={32} color="var(--primary)" /> Admin Dashboard
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Product List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px' }}>Product</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '10px' }}>{p.name}</td>
                            <td style={{ padding: '10px' }}>{formatCurrency(p.price)}</td>
                            <td style={{ padding: '10px' }}>
                                <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Add Product Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
                <input 
                    type="text" placeholder="Product Name" required
                    className="input-field" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                    type="number" placeholder="Price (EGP)" required
                    className="input-field" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <textarea 
                    placeholder="Description" required
                    className="input-field" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', height: '100px' }}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <input 
                    type="text" placeholder="Image URL (optional)" 
                    className="input-field" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                />
                <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Plus size={18} /> {loading ? 'Adding...' : 'Add Product'}
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
