import React, { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';

const ProductGrid = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    // Attempt to fetch from local API, fallback to mock data if offline/error
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("Backend not running, serving mock data");
        // Fallback Mock Data with Premium Images
        setProducts([
            {
                id: 1,
                name: "Zamazon Echo Dot",
                price: 2500, // EGP approx
                rating: 4.5,
                image: "https://images.unsplash.com/photo-1543512214-318c77a07298?auto=format&fit=crop&q=80&w=400",
                description: "Voice controlled smart speaker with Alexa."
              },
              {
                id: 2,
                name: "Zamazon Kindle Paperwhite",
                price: 7000,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&q=80&w=400",
                description: "Now with a 6.8” display and warmer light."
              },
              {
                id: 3,
                name: "Z-Phone 15 Pro",
                price: 55000,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1616410011236-7a4211f92276?auto=format&fit=crop&q=80&w=400", // iPhone style
                description: "The ultimate smartphone experience."
              },
              {
                id: 4,
                name: "Gaming Laptop Z-Series",
                price: 65000,
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400",
                description: "High performance gaming on the go."
              },
              {
                id: 5,
                name: "Wireless Headphones",
                price: 15000,
                rating: 4.4,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
                description: "Immersive sound with premium comfort."
              },
              {
                id: 6,
                name: "4K Ultra HD Smart TV",
                price: 25000,
                rating: 4.3,
                image: "https://images.unsplash.com/photo-1593784991095-a20506948430?auto=format&fit=crop&q=80&w=400",
                description: "Vibrant colors and incredible detail."
              }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <section className="container" style={{ paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Trending Now</h2>
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No products found matching "{searchQuery}"</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="glass-panel" 
              style={{ 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                animationDelay: `${index * 0.1}s` // Staggered animation
              }}
            >
              <div style={{ height: '220px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      padding: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? '#ef4444' : 'none'} color={isInWishlist(product.id) ? '#ef4444' : '#333'} />
                  </button>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{product.name}</h3>
                  <span style={{ 
                    background: 'rgba(139, 92, 246, 0.2)', 
                    color: '#d8b4fe', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.875rem', 
                    fontWeight: 'bold'
                  }}>{formatCurrency(product.price)}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                    <Star size={16} fill="#fbbf24" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.rating}</span>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => addToCart(product)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
