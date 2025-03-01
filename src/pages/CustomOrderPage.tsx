import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const CustomOrderPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: '',
    description: '',
    budget: '',
    timeline: '',
    attachments: null as File[] | null,
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, attachments: Array.from(e.target.files as FileList) }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderType: '',
      description: '',
      budget: '',
      timeline: '',
      attachments: null,
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Custom Order Request</h1>
            <p className="text-lg text-gray-600">
              Have something special in mind? Let us create a unique, handcrafted piece just for you.
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your custom order request has been submitted successfully. Our artisans will review your request and get back to you within 48 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <h2 className="text-xl font-medium text-gray-900 mb-4">Contact Information</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                      Order Type *
                    </label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    >
                      <option value="">Select an option</option>
                      <option value="custom-frame">Custom Frame</option>
                      <option value="personalized-gift">Personalized Gift</option>
                      <option value="home-decor">Home Decor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <h2 className="text-xl font-medium text-gray-900 mb-4 mt-6">Project Details</h2>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Project Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Please describe what you're looking for in detail. Include dimensions, materials, colors, and any other specific requirements."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    >
                      <option value="">Select a range</option>
                      <option value="under-50">Under $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-200">$100 - $200</option>
                      <option value="200-500">$200 - $500</option>
                      <option value="over-500">Over $500</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                      Desired Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    >
                      <option value="">Select a timeline</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="3-4-weeks">3-4 weeks</option>
                      <option value="1-2-months">1-2 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
                      Attachments (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {formData.attachments && formData.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {formData.attachments.length} file(s) selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Order Process</h2>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600">
                    <span className="text-lg font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Submit Your Request</h3>
                  <p className="mt-2 text-gray-600">
                    Fill out the form with as much detail as possible about your custom project.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600">
                    <span className="text-lg font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Consultation</h3>
                  <p className="mt-2 text-gray-600">
                    Our artisans will review your request and contact you within 48 hours to discuss details and provide a quote.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600">
                    <span className="text-lg font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Design Approval</h3>
                  <p className="mt-2 text-gray-600">
                    Once the details are finalized, we'll create a design concept for your approval before beginning production.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600">
                    <span className="text-lg font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Crafting</h3>
                  <p className="mt-2 text-gray-600">
                    Our skilled artisans will handcraft your custom piece with care and attention to detail.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600">
                    <span className="text-lg font-bold">5</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delivery</h3>
                  <p className="mt-2 text-gray-600">
                    Your finished piece will be carefully packaged and shipped to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;