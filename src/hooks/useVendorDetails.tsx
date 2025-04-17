import { supabase } from '@/integrations/supabase/client'
import { getVendorData } from '@/integrations/supabase/operations/getVendorData'
import { getVendorProducts } from '@/integrations/supabase/operations/getVendorProducts'
import { VendorProducts, VendorProfile } from '@/integrations/supabase/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const fetchVendorData = async (
  vendorId: string,
  setVendor: Dispatch<SetStateAction<VendorProfile>>,
  setLoading?: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true)
  try {
    const data = await getVendorData(vendorId)

    setVendor(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    // If we can't find the vendor, we'll show a fallback
    throw error
  } finally {
    setLoading(false)
  }
}

const fetchVendorProducts = async (
  vendorId: string,
  setProducts: Dispatch<SetStateAction<VendorProducts[]>>,
  setLoading?: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true)

  try {
    const data = await getVendorProducts(vendorId)

    setProducts(data || [])
  } catch (error) {
    console.error('Error fetching vendor products:', error)
    setProducts([])
  } finally {
    setLoading(false)
  }
}

export const useVendorDetails = (vendorId: string) => {
  const [vendor, setVendor] = useState<VendorProfile>(null)
  const [vendorLoading, setVendorLoading] = useState(true)
  const [products, setProducts] = useState<VendorProducts[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    fetchVendorData(vendorId, setVendor, setVendorLoading)
    fetchVendorProducts(vendorId, setProducts, setProductsLoading)
  }, [vendorId])

  return { vendor, vendorLoading, products, productsLoading }
}
