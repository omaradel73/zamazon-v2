import React, { useRef } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

import FeedbackSection from '../components/FeedbackSection';

const HomePage = ({ searchQuery }) => {
  const productsRef = useRef(null);
  const feedbackRef = useRef(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeedback = () => {
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {!searchQuery && <Hero scrollToProducts={scrollToProducts} scrollToFeedback={scrollToFeedback} />}
      <div ref={productsRef}>
        <ProductGrid searchQuery={searchQuery} />
      </div>
      {!searchQuery && (
        <div ref={feedbackRef}>
            <FeedbackSection />
        </div>
      )}
    </>
  );
};

export default HomePage;
