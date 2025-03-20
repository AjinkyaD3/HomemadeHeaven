// const ProductFormPage 
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface FormData {
  name: string;
  description: string;
  price: string;
  image: File | null;
  category: Product['category'];
  stock: string;
  rating: string;
  numReviews: string;
  materials: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
    unit: 'cm' | 'in';
  };
  isFeatured: boolean;
  customizable: boolean;
  isAvailable: boolean;
}

const ProductFormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "frame",
    stock: "",
    rating: "",
    numReviews: "",
    materials: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
      unit: "cm",
    },
    isFeatured: false,
    customizable: false,
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add predefined categories
  const categoryGroups = {
    'Frames': ['frame', 'photo-frame', 'wall-frame', 'table-frame', 'collage-frame', 'name-frame'],
    'Gifts': ['gift', 'personalized-gift', 'gift-box', 'gift-hamper'],
    'Bracelets': ['bracelet', 'personalized-bracelet', 'couple-bracelet'],
    'Phone Cases': ['phone-case', 'custom-phone-case'],
    'Home Decor': ['home-decor', 'wall-decor', 'table-decor'],
    'Special Occasions': ['anniversary-special', 'birthday-special', 'wedding-special']
  };

  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes("dimensions.")) {
      const dimensionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimensionField]: value },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    if (formData.image) {
      productData.append("image", formData.image);
    }
    productData.append("category", formData.category);
    productData.append("stock", formData.stock);
    productData.append("rating", formData.rating);
    productData.append("numReviews", formData.numReviews);
    productData.append("isFeatured", String(formData.isFeatured));
    productData.append("customizable", String(formData.customizable));
    productData.append("isAvailable", String(formData.isAvailable));
    
    // Materials handling (comma-separated string)
    formData.materials
      .split(",")
      .map((material) => productData.append("materials[]", material.trim()));

    // Add dimensions
    productData.append("dimensions[width]", formData.dimensions.width);
    productData.append("dimensions[height]", formData.dimensions.height);
    productData.append("dimensions[depth]", formData.dimensions.depth);
    productData.append("dimensions[unit]", formData.dimensions.unit);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product added:", response.data);
      navigate("/shop");
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {loading && <LoadingSpinner overlay />}
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-semibold">Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Category:</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            className="border p-2 rounded"
          >
            {Object.entries(categoryGroups).map(([group, categories]) => (
              <optgroup key={group} label={group}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Number of Reviews:</label>
          <input
            type="number"
            name="numReviews"
            value={formData.numReviews}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Materials (comma-separated):</label>
          <input
            type="text"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Dimensions (WxHxD):</label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              name="dimensions.width"
              placeholder="Width"
              value={formData.dimensions.width}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="dimensions.height"
              placeholder="Height"
              value={formData.dimensions.height}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="dimensions.depth"
              placeholder="Depth"
              value={formData.dimensions.depth}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="dimensions.unit"
              value={formData.dimensions.unit}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label>Featured</label>
          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />

          <label>Customizable</label>
          <input type="checkbox" name="customizable" checked={formData.customizable} onChange={handleChange} />

          <label>Available</label>
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {loading ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
