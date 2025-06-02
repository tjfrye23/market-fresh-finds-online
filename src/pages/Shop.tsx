
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/PageHeader'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopFilters from '@/components/shop/ShopFilters'
import ProductGrid from '@/components/shop/ProductGrid'
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts'
import { useShopFilters } from '@/hooks/useShopFilters'
import { getVendors } from '@/services/mockServices'

const Shop = () => {
  const [filterVisible, setFilterVisible] = useState(false)
  
  const { data: products = [], isLoading } = useMarketplaceProducts()
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })

  const {
    categoryFilter,
    setCategoryFilter,
    featuresFilter,
    setFeaturesFilter,
    priceRange,
    setPriceRange,
    vendorFilter,
    setVendorFilter,
    sortBy,
    setSortBy,
    getFilteredAndSortedProducts,
  } = useShopFilters()

  const filteredProducts = getFilteredAndSortedProducts(products)

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
              <ShopFilters
                filterVisible={filterVisible}
                setFilterVisible={setFilterVisible}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                featuresFilter={featuresFilter}
                setFeaturesFilter={setFeaturesFilter}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                vendorFilter={vendorFilter}
                setVendorFilter={setVendorFilter}
                vendors={vendors}
              />
              <p className="text-gray-600">
                {isLoading
                  ? 'Loading products...'
                  : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-600">
                Sort by:
              </label>
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

          <div className="flex gap-8">
            <ProductGrid 
              products={filteredProducts}
              vendors={vendors}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Shop
