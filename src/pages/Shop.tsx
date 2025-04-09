import { useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string | null;
  description: string | null;
  organic: boolean | null;
  local: boolean | null;
  category: string;
  farmer_id: string;
  created_at: string;
  updated_at: string;
}

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [filterVisible, setFilterVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [featuresFilter, setFeaturesFilter] = useState<{
    organic: boolean;
    local: boolean;
    inSeason: boolean;
  }>({
    organic: false,
    local: false,
    inSeason: false,
  });
  const [priceRange, setPriceRange] = useState<string>("all");
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return data || [];
    },
  });

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter((prev) => {
      if (category === "all") {
        return [];
      }
      
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleFeatureChange = (feature: "organic" | "local" | "inSeason") => {
    setFeaturesFilter((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
  };

  const getFilteredAndSortedProducts = () => {
    let result = [...products];
    
    if (categoryFilter.length > 0) {
      result = result.filter((product) => categoryFilter.includes(product.category));
    }
    
    if (featuresFilter.organic) {
      result = result.filter((product) => product.organic);
    }
    
    if (featuresFilter.local) {
      result = result.filter((product) => product.local);
    }
    
    if (priceRange === "under5") {
      result = result.filter((product) => product.price < 5);
    } else if (priceRange === "5to10") {
      result = result.filter((product) => product.price >= 5 && product.price <= 10);
    } else if (priceRange === "over10") {
      result = result.filter((product) => product.price > 10);
    }
    
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
              <p className="text-gray-600">
                {isLoading ? "Loading products..." : `Showing ${filteredProducts.length} products`}
              </p>
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
            
            <div className="md:w-3/4 lg:w-4/5">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      unit={product.unit}
                      image={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                      organic={product.organic || false}
                      local={product.local || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
