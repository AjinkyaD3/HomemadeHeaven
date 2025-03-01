import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-lg overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Custom Frames" 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Custom Frames</h3>
              <p className="text-gray-200 mb-4">Handcrafted frames to showcase your precious memories</p>
              <Link 
                to="/shop?category=frame" 
                className="inline-block bg-white text-gray-900 py-2 px-6 rounded-md font-medium hover:bg-rose-600 hover:text-white transition-colors duration-300"
              >
                Shop Frames
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Handmade Gifts" 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Handmade Gifts</h3>
              <p className="text-gray-200 mb-4">Unique artisanal gifts for every special occasion</p>
              <Link 
                to="/shop?category=gift" 
                className="inline-block bg-white text-gray-900 py-2 px-6 rounded-md font-medium hover:bg-rose-600 hover:text-white transition-colors duration-300"
              >
                Shop Gifts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;