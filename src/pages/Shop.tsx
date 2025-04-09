
import { useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Sample products data
  const products = [
    {
      id: "1",
      name: "Organic Strawberries",
      price: 4.99,
      unit: "1 lb package",
      image: "https://images.unsplash.com/photo-1518635017480-d9a4666b3a54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      organic: true,
      local: true,
      category: "fruits",
    },
    {
      id: "2",
      name: "Fresh Avocados",
      price: 2.49,
      unit: "Each",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
      organic: false,
      local: true,
      category: "fruits",
    },
    {
      id: "3",
      name: "Organic Kale Bunch",
      price: 3.29,
      unit: "Bundle",
      image: "https://images.unsplash.com/photo-1515471949468-fec1525563f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      organic: true,
      local: false,
      category: "vegetables",
    },
    {
      id: "4",
      name: "Artisan Sourdough Bread",
      price: 5.99,
      unit: "16 oz loaf",
      image: "https://images.unsplash.com/photo-1585478259715-4d3f6b5a0a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      organic: false,
      local: true,
      category: "bakery",
    },
    {
      id: "5",
      name: "Cherry Tomatoes",
      price: 3.99,
      unit: "Pint",
      image: "https://images.unsplash.com/photo-1494220394759-e0a001fe79a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      organic: true,
      local: true,
      category: "vegetables",
    },
    {
      id: "6",
      name: "Farm Fresh Eggs",
      price: 6.49,
      unit: "Dozen",
      image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      organic: true,
      local: true,
      category: "dairy-eggs",
    },
    {
      id: "7",
      name: "Organic Blueberries",
      price: 5.99,
      unit: "Pint",
      image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      organic: true,
      local: false,
      category: "fruits",
    },
    {
      id: "8",
      name: "Artisan Goat Cheese",
      price: 7.99,
      unit: "8 oz package",
      image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80",
      organic: false,
      local: true,
      category: "dairy-eggs",
    },
  ];

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let result = [...products];
    
    // Apply sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return result;
  };
  
  const filteredProducts = getFilteredAndSortedProducts();

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Shop Our Products" 
          description="Browse our selection of fresh, locally-sourced products"
          image="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
        />
        
        <div className="page-container">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center">
              <button 
                onClick={toggleFilter}
                className="mr-4 bg-market-gray px-4 py-2 rounded-md flex items-center md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <p className="text-gray-600">Showing {filteredProducts.length} products</p>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-green focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters - Hidden on mobile unless toggled */}
            <div className={`md:w-1/4 lg:w-1/5 ${filterVisible ? 'block' : 'hidden'} md:block`}>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Fruits</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Vegetables</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Dairy & Eggs</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Bakery</span>
                  </label>
                </div>
                
                <h3 className="font-semibold text-lg mt-6 mb-4">Features</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Organic</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Local</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>In Season</span>
                  </label>
                </div>
                
                <h3 className="font-semibold text-lg mt-6 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span>Under $5</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span>$5 to $10</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span>Over $10</span>
                  </label>
                </div>
                
                <button 
                  className="w-full bg-market-green-dark text-white py-2 rounded-md mt-6 hover:bg-market-green transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="md:w-3/4 lg:w-4/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
