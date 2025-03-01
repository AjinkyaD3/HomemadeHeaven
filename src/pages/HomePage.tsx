import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategorySection from '../components/CategorySection';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default HomePage;