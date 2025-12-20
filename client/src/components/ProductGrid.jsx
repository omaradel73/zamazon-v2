import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from local API, fallback to mock data if offline/error
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
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
    <section className="container page-enter" style={{ paddingBottom: '4rem' }}>
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
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
