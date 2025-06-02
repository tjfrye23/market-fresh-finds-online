
import { useState } from 'react'
import { Product } from '@/components/product/types'

interface FeaturesFilter {
  organic: boolean
  local: boolean
  inSeason: boolean
}

export const useShopFilters = () => {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [featuresFilter, setFeaturesFilter] = useState<FeaturesFilter>({
    organic: false,
    local: false,
    inSeason: false,
  })
  const [priceRange, setPriceRange] = useState<string>('all')
  const [vendorFilter, setVendorFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('featured')

  const getFilteredAndSortedProducts = (products: Product[]) => {
    let result = [...products]

    if (categoryFilter.length > 0) {
      result = result.filter((product) =>
        categoryFilter.includes(product.category),
      )
    }

    if (featuresFilter.organic) {
      result = result.filter((product) => product.organic)
    }

    if (featuresFilter.local) {
      result = result.filter((product) => product.local)
    }

    if (vendorFilter !== 'all') {
      result = result.filter((product) => product.user_id === vendorFilter)
    }

    if (priceRange === 'under5') {
      result = result.filter((product) => product.price < 5)
    } else if (priceRange === '5to10') {
      result = result.filter(
        (product) => product.price >= 5 && product.price <= 10,
      )
    } else if (priceRange === 'over10') {
      result = result.filter((product) => product.price > 10)
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    }

    return result
  }

  return {
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
  }
}
