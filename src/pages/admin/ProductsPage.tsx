import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  customizable: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  likes: number;
  numReviews: number;
  rating: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  createdAt: string;
  updatedAt: string;
  imageFile?: File;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Add predefined categories
  const predefinedCategories = ['frame', 'gift', 'gift-hamper', 'bracelet', 'phoneCase'];

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const data = await api.getProducts();
        setProducts(data);
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category)));
        setCategories(uniqueCategories);
      } catch (error: any) {
        console.error('❌ Error fetching products:', error.message);
        toast.error('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Delete product function
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting product:', error.message);
      toast.error('Failed to delete product');
    }
  };

  // ✅ Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // ✅ Handle input changes in the modal
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;

    const { name, value, type, checked } = e.target;

    // Handle nested dimension changes
    if (name.includes('dimensions')) {
      const dimensionKey = name.split('.')[1];
      setEditingProduct((prev) => ({
        ...prev!,
        dimensions: {
          ...prev!.dimensions,
          [dimensionKey]: value,
        },
      }));
    } else {
      setEditingProduct((prev) => ({
        ...prev!,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Add new function to handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    setEditingProduct(prev => ({
      ...prev!,
      image: imageUrl,
      imageFile: file
    }));
  };

  // ✅ Handle product update
  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      
      // Append all product data except image if no new file
      Object.entries(editingProduct).forEach(([key, value]) => {
        if (key === 'imageFile') return; // Skip the imageFile property
        if (key === 'image' && editingProduct.imageFile) return; // Skip image URL if we have a new file
        if (key === 'dimensions') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Append the new image file if it exists
      if (editingProduct.imageFile) {
        formData.append('image', editingProduct.imageFile);
      }

      await api.updateProduct(editingProduct._id, formData);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingProduct._id ? editingProduct : product
        )
      );

      toast.success('Product updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('❌ Error updating product:', error.message);
      toast.error('Failed to update product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Categories</option>
            {predefinedCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <Link
            to="/admin/products/new"
            className="bg-rose-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="mr-2" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* ✅ Loading spinner */}
      {isLoading ? (
        <LoadingSpinner size="large" overlay />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-md p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
              <h2 className="text-lg font-bold mt-2">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-800 font-semibold mt-2">Rs: {product.price}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openEditModal(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="inline-block mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="inline-block mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editingProduct.description}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                  >
                    {predefinedCategories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        className="h-32 w-32 object-cover rounded-md border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
                        <p className="text-sm text-gray-500 truncate">{editingProduct.image}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-rose-50 file:text-rose-700
                          hover:file:bg-rose-100
                          focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={editingProduct.dimensions.width}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      name="dimensions.height"
                      value={editingProduct.dimensions.height}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
                    <input
                      type="number"
                      name="dimensions.depth"
                      value={editingProduct.dimensions.depth}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="dimensions.unit"
                      value={editingProduct.dimensions.unit}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="cm">Centimeters</option>
                      <option value="in">Inches</option>
                      <option value="m">Meters</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="customizable"
                      checked={editingProduct.customizable}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Customizable</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={editingProduct.isAvailable}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Available</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={editingProduct.isFeatured}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Featured</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
