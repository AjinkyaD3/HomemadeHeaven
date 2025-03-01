import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { Product } from "../types";

const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryParam = searchParams.get("category");
  const featuredParam = searchParams.get("featured");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showCustomizable, setShowCustomizable] = useState<boolean>(false);
  const [showInStock, setShowInStock] = useState<boolean>(true);

  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply featured filter
    if (featuredParam === "true") {
      result = result.filter((product) => product.featured);
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply customizable filter
    if (showCustomizable) {
      result = result.filter((product) => product.customizable);
    }

    // Apply in-stock filter
    if (showInStock) {
      result = result.filter((product) => product.inStock);
    }

    setFilteredProducts(result);
  }, [
    selectedCategory,
    featuredParam,
    priceRange,
    showCustomizable,
    showInStock,
  ]);

  // Update selected category when URL param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Mobile filter button */}
          <div className="w-full md:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-md shadow-sm border border-gray-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Sidebar filters - desktop always visible, mobile conditional */}
          <div
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-64 bg-white p-6 rounded-lg shadow-sm sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Category
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    All Products
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "frame"}
                    onChange={() => setSelectedCategory("frame")}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Frames</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "gift"}
                    onChange={() => setSelectedCategory("gift")}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Gifts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "bracelet"}
                    onChange={() => setSelectedCategory("bracelet")}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bracelets</span>
                </label>
                {/* Add Gift Hamper Category */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "gift-hamper"}
                    onChange={() => setSelectedCategory("gift-hamper")}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Gift Hampers
                  </span>
                </label>
                {/* Add Phone Case Category */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "phoneCase"}
                    onChange={() => setSelectedCategory("phoneCase")}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Phone Cases
                  </span>
                </label>
              </div>
            </div>
            {/* Other filters (price, customizable, stock) */}
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory === null
                  ? "All Products"
                  : selectedCategory === "frame"
                  ? "Custom Frames"
                  : selectedCategory === "gift"
                  ? "Handmade Gifts"
                  : selectedCategory === "bracelet"
                  ? "Bracelets"
                  : selectedCategory === "gift-hamper"
                  ? "Gift Hampers"
                  : selectedCategory === "phoneCase"
                  ? "Phone Cases"
                  : featuredParam === "true"
                  ? "Featured Products"
                  : "All Products"}
              </h1>
              <p className="text-gray-500 mt-1">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No products match your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 200]);
                    setShowCustomizable(false);
                    setShowInStock(true);
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
