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

  // ✅ Handle product update
  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      Object.entries(editingProduct).forEach(([key, value]) => {
        if (key === 'dimensions') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

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
        <Link
          to="/admin/products/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-md"
        >
          <Plus className="inline-block mr-2" />
          Add New Product
        </Link>
      </div>

      {/* ✅ Loading spinner */}
      {isLoading ? (
        <LoadingSpinner size="large" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <X onClick={closeModal} className="cursor-pointer" />
            </div>
            
            <input name="name" value={editingProduct.name} onChange={handleEditChange} placeholder="Product Name" className="w-full p-2 border rounded-md" />
            
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md">Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
