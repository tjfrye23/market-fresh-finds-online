
import { MockVendorProfile, MockProduct, mockVendors, mockProducts } from '@/data/mockData'

// Vendor services
export const getVendorData = async (id: string): Promise<MockVendorProfile> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const vendor = mockVendors.find(v => v.id === id)
  if (!vendor) {
    throw new Error('Vendor not found')
  }
  return vendor
}

export const getVendorByUserId = async (userId: string): Promise<MockVendorProfile | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const vendor = mockVendors.find(v => v.user_id === userId)
  return vendor || null
}

export const saveVendorProfile = async (profile: Partial<MockVendorProfile>, userId: string): Promise<MockVendorProfile> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const existingIndex = mockVendors.findIndex(v => v.user_id === userId)
  
  if (existingIndex >= 0) {
    // Update existing vendor
    const updated = { ...mockVendors[existingIndex], ...profile, updated_at: new Date().toISOString() }
    mockVendors[existingIndex] = updated
    return updated
  } else {
    // Create new vendor
    const newVendor: MockVendorProfile = {
      id: 'vendor_' + Date.now(),
      user_id: userId,
      vendor_name: profile.vendor_name || '',
      owner_name: profile.owner_name || '',
      location: profile.location || null,
      specialty: profile.specialty || null,
      description: profile.description || null,
      image_url: profile.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockVendors.push(newVendor)
    return newVendor
  }
}

// Product services
export const getMarketplaceProducts = async (): Promise<MockProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return [...mockProducts]
}

export const getVendorProducts = async (vendorId: string): Promise<MockProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockProducts.filter(p => p.user_id === vendorId)
}

export const saveProduct = async (product: Partial<MockProduct>, userId: string): Promise<MockProduct> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (product.id) {
    // Update existing product
    const existingIndex = mockProducts.findIndex(p => p.id === product.id)
    if (existingIndex >= 0) {
      const updated = { ...mockProducts[existingIndex], ...product, updated_at: new Date().toISOString() }
      mockProducts[existingIndex] = updated
      return updated
    }
  }
  
  // Create new product
  const newProduct: MockProduct = {
    id: 'product_' + Date.now(),
    user_id: userId,
    name: product.name || '',
    price: product.price || 0,
    unit: product.unit || '',
    category: product.category || '',
    description: product.description || null,
    image: product.image || null,
    organic: product.organic || false,
    local: product.local || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  mockProducts.push(newProduct)
  return newProduct
}

export const deleteProduct = async (productId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockProducts.findIndex(p => p.id === productId)
  if (index >= 0) {
    mockProducts.splice(index, 1)
  }
}
