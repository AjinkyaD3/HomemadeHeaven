import React from 'react';
import { Gift } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1558180077-09f158c76707?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Artisan workshop" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            HandmadeHeaven was born from a passion for craftsmanship and a belief that handmade items carry a special energy that mass-produced products simply cannot match.
          </p>
        </div>
      </div>
      
      {/* Mission section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                At HandmadeHeaven, our mission is to celebrate the beauty of handcrafted artistry in a world dominated by mass production. We believe that every handmade piece tells a story – of tradition, skill, and the human touch that makes it unique.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We're dedicated to creating custom frames and gifts that not only preserve your precious memories but also serve as works of art in their own right. Each piece is crafted with intention, care, and a commitment to quality that honors both the materials we use and the moments they commemorate.
              </p>
            </div>
            
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Artisan working on a wooden frame" 
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
              The principles that guide everything we do at HandmadeHeaven.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Craftsmanship</h3>
              <p className="text-gray-500">
                We believe in the value of skilled craftsmanship and the beauty that comes from creating something by hand. Each piece is made with attention to detail and a commitment to excellence.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-500">
                We're committed to sustainable practices, using responsibly sourced materials and minimizing waste. We believe in creating products that are not only beautiful but also kind to our planet.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Personalization</h3>
              <p className="text-gray-500">
                We celebrate individuality and believe that meaningful gifts should reflect the unique personalities and relationships they represent. That's why customization is at the heart of what we do.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Artisans
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
              The talented hands and creative minds behind HandmadeHeaven's unique creations.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Emma Thompson" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Emma Thompson</h3>
              <p className="text-rose-600 mb-2">Founder & Lead Designer</p>
              <p className="text-gray-500 max-w-xs mx-auto">
                With over 15 years of experience in woodworking and design, Emma brings a unique vision to every piece she creates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="David Chen" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">David Chen</h3>
              <p className="text-rose-600 mb-2">Master Craftsman</p>
              <p className="text-gray-500 max-w-xs mx-auto">
                David specializes in intricate woodworking techniques passed down through generations, creating frames that are true works of art.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Sophia Rodriguez" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Sophia Rodriguez</h3>
              <p className="text-rose-600 mb-2">Personalization Specialist</p>
              <p className="text-gray-500 max-w-xs mx-auto">
                With a background in calligraphy and engraving, Sophia adds the perfect finishing touches to make each piece uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-rose-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to own a piece of HandmadeHeaven?</span>
            <span className="block text-rose-200">Start your custom order today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/custom"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-rose-50"
              >
                <Gift className="mr-2 h-5 w-5" />
                Custom Order
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-800 hover:bg-rose-700"
              >
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;