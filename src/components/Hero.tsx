import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-50">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Handcrafted items background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Handcrafted with Love
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-xl">
            Discover unique, artisanal gifts and custom frames that celebrate life's special moments. Each piece tells a story, crafted with care and attention to detail.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/shop"
              className="inline-block bg-rose-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-rose-700 transition-colors duration-300"
            >
              Shop Collection
            </Link>
            <Link
              to="/custom"
              className="inline-block bg-transparent border border-white rounded-md py-3 px-8 font-medium text-white hover:bg-white hover:text-gray-900 transition-colors duration-300"
            >
              Custom Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;