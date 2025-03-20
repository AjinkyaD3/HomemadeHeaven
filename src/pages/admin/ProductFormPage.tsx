// const ProductFormPage 
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductFormPage = () => {
  const [formData, setFormData] = useState({
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("image", formData.image);
    productData.append("category", formData.category);
    productData.append("stock", formData.stock);
    productData.append("rating", formData.rating);
    productData.append("numReviews", formData.numReviews);
    productData.append("isFeatured", formData.isFeatured);
    productData.append("customizable", formData.customizable);
    productData.append("isAvailable", formData.isAvailable);
    
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
      const token = localStorage.getItem("token"); // Add your auth token retrieval logic
      const response = await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product added:", response.data);
      navigate("/shop");
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
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
          <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded">
            <option value="frame">Frame</option>
            <option value="gift">Gift</option>
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
