import React, { useRef } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

const HomePage = ({ searchQuery }) => {
  const productsRef = useRef(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {!searchQuery && <Hero scrollToProducts={scrollToProducts} />}
      <div ref={productsRef}>
        <ProductGrid searchQuery={searchQuery} />
      </div>
    </>
  );
};

export default HomePage;
