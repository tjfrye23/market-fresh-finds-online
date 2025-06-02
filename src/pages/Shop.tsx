
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'
import { mockProducts, mockVendors } from '@/data/mockData'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import ShopAvailabilityBanner from '@/components/ShopAvailabilityBanner'
import { useShopFilters } from '@/hooks/useShopFilters'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [vendors, setVendors] = useState(mockVendors)
  const [filterVisible, setFilterVisible] = useState(false)
  const { isShopOpen } = useMarketSchedule()
  
  const {
    categoryFilter,
    setCategoryFilter,
    featuresFilter,
    setFeaturesFilter,
    priceRange,
    setPriceRange,
    vendorFilter,
    setVendorFilter,
    getFilteredAndSortedProducts,
  } = useShopFilters()

  useEffect(() => {
    const initialCategories = searchParams.getAll('category')
    setCategoryFilter(initialCategories)
  }, [searchParams, setCategoryFilter])

  const filteredProducts = getFilteredAndSortedProducts(products)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader title="Fresh Market" />
        <div className="container mx-auto px-4 py-8">
          <ShopAvailabilityBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
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
            </div>
            <div className="lg:col-span-3">
              <ProductGrid 
                products={filteredProducts} 
                vendors={vendors}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Shop
