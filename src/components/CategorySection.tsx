import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection: React.FC = () => {
  const categories = [
    {
      name: "Custom Frames",
      description: "Handcrafted frames to showcase your precious memories",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "frame"
    },
    {
      name: "Handmade Gifts",
      description: "Unique artisanal gifts for every special occasion",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "gift"
    },
    {
      name: "Gift Hampers",
      description: "Beautifully curated gift sets for your loved ones",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "gift-hamper"
    },
    {
      name: "Personalized Bracelets",
      description: "Custom designed bracelets with personal touch",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "bracelet"
    },
    {
      name: "Phone Cases",
      description: "Stylish and protective custom phone cases",
      image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "phone-case"
    },
    {
      name: "Home Decor",
      description: "Beautiful decorative items for your home",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      link: "home-decor"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden group">
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-200 mb-4">{category.description}</p>
                <Link 
                  to={`/shop?category=${category.link}`}
                  className="inline-block bg-white text-gray-900 py-2 px-6 rounded-md font-medium hover:bg-rose-600 hover:text-white transition-colors duration-300"
                >
                  Shop {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;