import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-rose-400" />
              <span className="ml-2 text-xl font-bold">HandmadeHeaven</span>
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              Bringing artisanal craftsmanship to your home with handcrafted gifts and custom frames that tell your unique story.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rose-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rose-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rose-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="mailto:contact@handmadeheaven.com" className="text-gray-300 hover:text-rose-400">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/shop?category=frame" className="text-gray-300 hover:text-rose-400">
                  Custom Frames
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gift" className="text-gray-300 hover:text-rose-400">
                  Handmade Gifts
                </Link>
              </li>
              <li>
                <Link to="/custom" className="text-gray-300 hover:text-rose-400">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className="text-gray-300 hover:text-rose-400">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Customer Service</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-rose-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-rose-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-rose-400">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-rose-400">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-rose-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-gray-300 hover:text-rose-400">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-300 hover:text-rose-400">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-rose-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} HandmadeHeaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;