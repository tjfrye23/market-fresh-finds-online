
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'
import MarketDaySelector from '@/components/shop/MarketDaySelector'
import { mockProducts, mockVendors, mockMarketDays } from '@/data/mockData'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import ShopAvailabilityBanner from '@/components/ShopAvailabilityBanner'
import { useShopFilters } from '@/hooks/useShopFilters'

interface MarketDayProduct {
  productId: string
  productName: string
  productPrice: number
  productUnit: string
  productImage?: string
  quantity: number
  packageSize: string
  prepackaged: boolean
  packageId?: string
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [vendors, setVendors] = useState(mockVendors)
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedMarketDay, setSelectedMarketDay] = useState<string>('')
  const [marketDayProducts, setMarketDayProducts] = useState<any[]>([])
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

  // Store selected market day in localStorage for ProductDetail page
  useEffect(() => {
    if (selectedMarketDay) {
      localStorage.setItem('selectedMarketDay', selectedMarketDay)
    } else {
      localStorage.removeItem('selectedMarketDay')
    }
  }, [selectedMarketDay])

  // Load products for the selected market day
  useEffect(() => {
    if (selectedMarketDay) {
      // Find the selected market day
      const marketDay = mockMarketDays.find(day => day.id === selectedMarketDay)
      
      if (marketDay && marketDay.products.length > 0) {
        // Filter products to only show those associated with this market day
        const associatedProducts = mockProducts.filter(product => 
          marketDay.products.includes(product.id)
        )
        setMarketDayProducts(associatedProducts)
      } else {
        // Check localStorage for market day products (fallback for existing data)
        const storedProducts = localStorage.getItem(`market_day_products_${selectedMarketDay}`)
        if (storedProducts) {
          const marketDayProductsData: MarketDayProduct[] = JSON.parse(storedProducts)
          
          // Group by productId and aggregate quantities for display
          const productMap = new Map()
          
          marketDayProductsData
            .filter(mdp => mdp.quantity > 0)
            .forEach(mdp => {
              if (productMap.has(mdp.productId)) {
                // Add to existing product's total stock
                const existing = productMap.get(mdp.productId)
                existing.stock += mdp.quantity
              } else {
                // Find the original product to get additional details
                const originalProduct = mockProducts.find(p => p.id === mdp.productId)
                if (originalProduct) {
                  productMap.set(mdp.productId, {
                    id: mdp.productId,
                    name: mdp.productName,
                    price: mdp.productPrice,
                    unit: mdp.productUnit,
                    image: mdp.productImage || originalProduct.image,
                    category: originalProduct.category || 'Other',
                    organic: originalProduct.organic || false,
                    local: originalProduct.local || false,
                    user_id: originalProduct.user_id || '',
                    description: originalProduct.description,
                    stock: mdp.quantity,
                    created_at: originalProduct.created_at || new Date().toISOString(),
                    updated_at: originalProduct.updated_at || new Date().toISOString(),
                  })
                }
              }
            })
          
          setMarketDayProducts(Array.from(productMap.values()))
        } else {
          setMarketDayProducts([])
        }
      }
    } else {
      setMarketDayProducts([])
    }
  }, [selectedMarketDay])

  // Use mock market days instead of context
  const marketDays = mockMarketDays.map(day => ({
    id: day.id,
    scheduleId: day.scheduleId,
    scheduleName: day.scheduleName,
    marketDate: day.marketDate,
    startTime: day.startTime,
    endTime: day.endTime,
    onlineStartTime: day.onlineStartTime,
    onlineEndTime: day.onlineEndTime,
    onlineStartDate: day.onlineStartDate,
    onlineEndDate: day.onlineEndDate,
    address: day.address,
    description: day.description,
    status: day.status,
    createdAt: day.created_at
  }))

  const selectedMarketDayData = marketDays.find(day => day.id === selectedMarketDay)

  const filteredProducts = getFilteredAndSortedProducts(marketDayProducts)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader title="Market" />
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
