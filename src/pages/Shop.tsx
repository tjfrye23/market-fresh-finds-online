import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductGrid from '@/components/ProductGrid'
import ShopFilters from '@/components/ShopFilters'
import { mockProducts, mockVendors } from '@/data/mockData'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import ShopAvailabilityBanner from '@/components/ShopAvailabilityBanner'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [categories, setCategories] = useState([
    'vegetables',
    'fruits',
    'herbs',
  ])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10 })
  const [showOrganic, setShowOrganic] = useState(false)
  const [showLocal, setShowLocal] = useState(false)
  const [vendors, setVendors] = useState(mockVendors)
  const [selectedVendors, setSelectedVendors: any] = useState([])
  const { isShopOpen } = useMarketSchedule()
  const shopOpen = isShopOpen()

  useEffect(() => {
    const initialCategories = searchParams.getAll('category')
    setSelectedCategories(initialCategories)
  }, [searchParams])

  const handleCategoryChange = (category: string) => {
    let newCategories
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter((c) => c !== category)
    } else {
      newCategories = [...selectedCategories, category]
    }

    setSelectedCategories(newCategories)
    setSearchParams({ category: newCategories })
  }

  const handleVendorChange = (vendorId: string) => {
    let newVendors
    if (selectedVendors.includes(vendorId)) {
      newVendors = selectedVendors.filter((v: string) => v !== vendorId)
    } else {
      newVendors = [...selectedVendors, vendorId]
    }

    setSelectedVendors(newVendors)
  }

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category)
    const priceMatch =
      product.price >= priceRange.min && product.price <= priceRange.max
    const organicMatch = !showOrganic || product.organic === showOrganic
    const localMatch = !showLocal || product.local === showLocal
    const vendorMatch =
      selectedVendors.length === 0 || selectedVendors.includes(product.user_id)

    return (
      categoryMatch &&
      priceMatch &&
      organicMatch &&
      localMatch &&
      vendorMatch
    )
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Fresh Market" 
          subtitle="Farm-fresh produce delivered to your door"
        />
        <div className="container mx-auto px-4 py-8">
          <ShopAvailabilityBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ShopFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                showOrganic={showOrganic}
                onOrganicChange={setShowOrganic}
                showLocal={showLocal}
                onLocalChange={setShowLocal}
                vendors={vendors}
                selectedVendors={selectedVendors}
                onVendorChange={handleVendorChange}
              />
            </div>
            <div className="lg:col-span-3">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Shop
