import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Package } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/products/${editingId}`
        : `/api/products`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
         fetchProducts();
         setFormData({ name: '', price: '', description: '', image: '', category: '' });
         setEditingId(null);
      }
    } catch (error) {
       console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
     if (!confirm("Are you sure you want to delete this product?")) return;
     try {
       await fetch(`/api/products/${id}`, {
         method: 'DELETE',
       });
       fetchProducts();
     } catch (error) {
       console.error("Error deleting product:", error);
     }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
        <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="text"
                        name="name" 
                        placeholder="Product Name" 
                        className="input-field"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="number"
                        name="price" 
                        placeholder="Price (EGP)" 
                        className="input-field"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <textarea 
                        name="description" 
                        placeholder="Description" 
                        className="input-field"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                     <input 
                        type="text"
                        name="image" 
                        placeholder="Image URL" 
                        className="input-field"
                        value={formData.image}
                        onChange={handleChange}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {editingId ? 'Update Product' : 'Add Product'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                className="btn" 
                                onClick={() => { setEditingId(null); setFormData({ name: '', price: '', description: '', image: '', category: '' }); }}
                                style={{ background: '#ef4444' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="md:col-span-2">
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Product</th>
                                <th style={{ padding: '1rem' }}>Price</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <span>{product.name}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatCurrency(product.price)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            style={{ marginRight: '10px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminPage;
