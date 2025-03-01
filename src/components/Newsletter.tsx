import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Subscribing email:', email);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-rose-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Mail className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new product announcements, and artisan stories.
          </p>
          
          {isSubmitted ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-white font-medium">
                Thank you for subscribing! Check your email for a special welcome gift.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;