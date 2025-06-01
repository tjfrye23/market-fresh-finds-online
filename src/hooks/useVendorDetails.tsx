
import { useState, useEffect } from 'react'
import { getVendorData, getVendorProducts } from '@/services/mockServices'
import { MockVendorProfile, MockProduct } from '@/data/mockData'

export const useVendorDetails = (vendorId: string) => {
  const [vendor, setVendor] = useState<MockVendorProfile | null>(null)
  const [vendorLoading, setVendorLoading] = useState(true)
  const [products, setProducts] = useState<MockProduct[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const fetchVendorData = async () => {
      setVendorLoading(true)
      try {
        const data = await getVendorData(vendorId)
        setVendor(data)
      } catch (error) {
        console.error('Error fetching vendor:', error)
        setVendor(null)
      } finally {
        setVendorLoading(false)
      }
    }

    const fetchVendorProducts = async () => {
      setProductsLoading(true)
      try {
        const data = await getVendorProducts(vendorId)
        setProducts(data)
      } catch (error) {
        console.error('Error fetching vendor products:', error)
        setProducts([])
      } finally {
        setProductsLoading(false)
      }
    }

    if (vendorId) {
      fetchVendorData()
      fetchVendorProducts()
    }
  }, [vendorId])

  return { vendor, vendorLoading, products, productsLoading }
}
