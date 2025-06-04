
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'
import MarketDaySelector from '@/components/shop/MarketDaySelector'
import { mockProducts, mockVendors } from '@/data/mockData'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import ShopAvailabilityBanner from '@/components/ShopAvailabilityBanner'
import { useShopFilters } from '@/hooks/useShopFilters'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [vendors, setVendors] = useState(mockVendors)
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedMarketDay, setSelectedMarketDay] = useState<string>('')
  const { isShopOpen, getUpcomingMarketDays } = useMarketSchedule()
  
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

  const marketDays = getUpcomingMarketDays()
  const selectedMarketDayData = marketDays.find(day => day.id === selectedMarketDay)
  
  // Filter products by selected market day - for now, we'll simulate this
  // In a real app, this would come from the backend based on vendor subscriptions
  const marketDayProducts = selectedMarketDay ? products.filter(product => {
    // Simulate that vendors have added products to specific market days
    // This would be replaced with actual backend logic
    const vendor = vendors.find(v => v.user_id === product.user_id)
    return vendor?.status === 'active'
  }) : []

  const filteredProducts = getFilteredAndSortedProducts(marketDayProducts)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader title="Fresh Market" />
        <div className="container mx-auto px-4 py-8">
          <ShopAvailabilityBanner />
          
          {/* Market Day Selection */}
          <div className="mb-6">
            <MarketDaySelector
              marketDays={marketDays}
              selectedMarketDay={selectedMarketDay}
              onSelectMarketDay={setSelectedMarketDay}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 lg:flex-shrink-0">
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
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {selectedMarketDay ? (
                <ProductGrid 
                  products={filteredProducts} 
                  vendors={vendors}
                  isLoading={false}
                  selectedMarketDay={selectedMarketDayData}
                />
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">
                    Select a Market Day
                  </h3>
                  <p className="text-gray-500">
                    Please select a market day above to view available products for that day.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Shop
