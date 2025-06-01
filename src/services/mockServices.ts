
import { MockProduct, MockVendorProfile, mockProducts, mockVendors } from '@/data/mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getMarketplaceProducts = async (): Promise<MockProduct[]> => {
  await delay(500)
  
  // Get products from localStorage or use mock data
  const storedProducts = localStorage.getItem('marketplace_products')
  if (storedProducts) {
    return JSON.parse(storedProducts)
  }
  
  // Store initial mock data
  localStorage.setItem('marketplace_products', JSON.stringify(mockProducts))
  return mockProducts
}

export const getVendorProducts = async (vendorId: string): Promise<MockProduct[]> => {
  await delay(300)
  
  const storedProducts = localStorage.getItem('marketplace_products')
  const products = storedProducts ? JSON.parse(storedProducts) : mockProducts
  
  return products.filter((product: MockProduct) => product.user_id === vendorId)
}

export const getVendorData = async (vendorId: string): Promise<MockVendorProfile | null> => {
  await delay(300)
  
  const storedVendors = localStorage.getItem('vendors')
  const vendors = storedVendors ? JSON.parse(storedVendors) : mockVendors
  
  return vendors.find((vendor: MockVendorProfile) => vendor.id === vendorId) || null
}

export const getVendors = async (): Promise<MockVendorProfile[]> => {
  await delay(400)
  
  const storedVendors = localStorage.getItem('vendors')
  if (storedVendors) {
    return JSON.parse(storedVendors)
  }
  
  // Store initial mock data
  localStorage.setItem('vendors', JSON.stringify(mockVendors))
  return mockVendors
}

export const addProduct = async (productData: Omit<MockProduct, 'id' | 'created_at' | 'updated_at'>): Promise<MockProduct> => {
  await delay(300)
  
  const storedProducts = localStorage.getItem('marketplace_products')
  const products = storedProducts ? JSON.parse(storedProducts) : []
  
  const newProduct: MockProduct = {
    ...productData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  const updatedProducts = [...products, newProduct]
  localStorage.setItem('marketplace_products', JSON.stringify(updatedProducts))
  
  return newProduct
}

export const updateProduct = async (productId: string, productData: Partial<MockProduct>): Promise<MockProduct> => {
  await delay(300)
  
  const storedProducts = localStorage.getItem('marketplace_products')
  const products = storedProducts ? JSON.parse(storedProducts) : []
  
  const productIndex = products.findIndex((p: MockProduct) => p.id === productId)
  if (productIndex === -1) {
    throw new Error('Product not found')
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    updated_at: new Date().toISOString(),
  }
  
  products[productIndex] = updatedProduct
  localStorage.setItem('marketplace_products', JSON.stringify(products))
  
  return updatedProduct
}

export const deleteProduct = async (productId: string): Promise<void> => {
  await delay(300)
  
  const storedProducts = localStorage.getItem('marketplace_products')
  const products = storedProducts ? JSON.parse(storedProducts) : []
  
  const filteredProducts = products.filter((p: MockProduct) => p.id !== productId)
  localStorage.setItem('marketplace_products', JSON.stringify(filteredProducts))
}

export const updateVendorProfile = async (vendorId: string, profileData: Partial<MockVendorProfile>): Promise<MockVendorProfile> => {
  await delay(300)
  
  const storedVendors = localStorage.getItem('vendors')
  const vendors = storedVendors ? JSON.parse(storedVendors) : mockVendors
  
  const vendorIndex = vendors.findIndex((v: MockVendorProfile) => v.id === vendorId)
  if (vendorIndex === -1) {
    throw new Error('Vendor not found')
  }
  
  const updatedVendor = {
    ...vendors[vendorIndex],
    ...profileData,
    updated_at: new Date().toISOString(),
  }
  
  vendors[vendorIndex] = updatedVendor
  localStorage.setItem('vendors', JSON.stringify(vendors))
  
  return updatedVendor
}
