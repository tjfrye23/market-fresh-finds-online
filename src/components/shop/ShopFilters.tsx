
import { useState } from 'react'
import { Filter } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Vendor {
  id: string
  user_id: string
  farm_name?: string
  vendor_name?: string
}

interface ShopFiltersProps {
  filterVisible: boolean
  setFilterVisible: (visible: boolean) => void
  categoryFilter: string[]
  setCategoryFilter: (categories: string[]) => void
  featuresFilter: {
    organic: boolean
    local: boolean
    inSeason: boolean
  }
  setFeaturesFilter: (features: { organic: boolean; local: boolean; inSeason: boolean }) => void
  priceRange: string
  setPriceRange: (range: string) => void
  vendorFilter: string
  setVendorFilter: (vendorId: string) => void
  vendors: Vendor[]
}

const ShopFilters = ({
  filterVisible,
  setFilterVisible,
  categoryFilter,
  setCategoryFilter,
  featuresFilter,
  setFeaturesFilter,
  priceRange,
  setPriceRange,
  vendorFilter,
  setVendorFilter,
  vendors,
}: ShopFiltersProps) => {
  const toggleFilter = () => {
    setFilterVisible(!filterVisible)
  }

  const handleCategoryChange = (category: string) => {
    setCategoryFilter((prev) => {
      if (category === 'all') {
        return []
      }

      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleFeatureChange = (feature: 'organic' | 'local' | 'inSeason') => {
    setFeaturesFilter((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range)
  }

  const handleVendorChange = (vendorId: string) => {
    setVendorFilter(vendorId)
  }

  return (
    <>
      <button
        onClick={toggleFilter}
        className="mr-4 bg-market-gray px-4 py-2 rounded-md flex items-center md:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </button>
      
      <div className={`md:w-1/4 lg:w-1/5 ${filterVisible ? 'block' : 'hidden'} md:block`}>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-4">Filters</h2>
          
          <Accordion type="multiple" defaultValue={["categories", "vendor", "features", "price"]} className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger className="text-lg font-semibold">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.length === 0}
                      onChange={() => handleCategoryChange('all')}
                    />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.includes('fruits')}
                      onChange={() => handleCategoryChange('fruits')}
                    />
                    <span>Fruits</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.includes('vegetables')}
                      onChange={() => handleCategoryChange('vegetables')}
                    />
                    <span>Vegetables</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.includes('herbs')}
                      onChange={() => handleCategoryChange('herbs')}
                    />
                    <span>Herbs</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.includes('dairy')}
                      onChange={() => handleCategoryChange('dairy')}
                    />
                    <span>Dairy & Eggs</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={categoryFilter.includes('bakery')}
                      onChange={() => handleCategoryChange('bakery')}
                    />
                    <span>Bakery</span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vendor">
              <AccordionTrigger className="text-lg font-semibold">Vendor</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="vendor" 
                      className="mr-2"
                      checked={vendorFilter === 'all'}
                      onChange={() => handleVendorChange('all')}
                    />
                    <span>All Vendors</span>
                  </label>
                  {vendors.map((vendor) => (
                    <label key={vendor.id} className="flex items-center">
                      <input 
                        type="radio" 
                        name="vendor" 
                        className="mr-2"
                        checked={vendorFilter === vendor.user_id}
                        onChange={() => handleVendorChange(vendor.user_id)}
                      />
                      <span>{vendor.farm_name || vendor.vendor_name}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features">
              <AccordionTrigger className="text-lg font-semibold">Features</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={featuresFilter.organic}
                      onChange={() => handleFeatureChange('organic')}
                    />
                    <span>Organic</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={featuresFilter.local}
                      onChange={() => handleFeatureChange('local')}
                    />
                    <span>Local</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={featuresFilter.inSeason}
                      onChange={() => handleFeatureChange('inSeason')}
                    />
                    <span>In Season</span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger className="text-lg font-semibold">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      className="mr-2"
                      checked={priceRange === 'all'}
                      onChange={() => handlePriceRangeChange('all')}
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      className="mr-2"
                      checked={priceRange === 'under5'}
                      onChange={() => handlePriceRangeChange('under5')}
                    />
                    <span>Under $5</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      className="mr-2"
                      checked={priceRange === '5to10'}
                      onChange={() => handlePriceRangeChange('5to10')}
                    />
                    <span>$5 to $10</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      className="mr-2"
                      checked={priceRange === 'over10'}
                      onChange={() => handlePriceRangeChange('over10')}
                    />
                    <span>Over $10</span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  )
}

export default ShopFilters
