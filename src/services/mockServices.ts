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

export const saveProduct = async (productData: Partial<MockProduct> & { id?: string }, userId: string): Promise<MockProduct> => {
  if (productData.id) {
    // Update existing product
    return await updateProduct(productData.id, productData)
  } else {
    // Create new product
    return await addProduct({
      ...productData,
      user_id: userId,
      name: productData.name || '',
      unit: productData.unit || '',
      category: productData.category || '',
      price: productData.price || 0,
      description: productData.description || null,
      image: productData.image || null,
      organic: productData.organic || false,
      local: productData.local || false,
      stock: productData.stock || 10, // Default stock value for new products
    })
  }
}

export const getVendorByUserId = async (userId: string): Promise<MockVendorProfile | null> => {
  await delay(300)
  
  const storedVendors = localStorage.getItem('vendors')
  const vendors = storedVendors ? JSON.parse(storedVendors) : mockVendors
  
  return vendors.find((vendor: MockVendorProfile) => vendor.user_id === userId) || null
}

export const saveVendorProfile = async (profileData: Partial<MockVendorProfile>, userId: string): Promise<MockVendorProfile> => {
  await delay(300)
  
  const storedVendors = localStorage.getItem('vendors')
  const vendors = storedVendors ? JSON.parse(storedVendors) : mockVendors
  
  const existingVendorIndex = vendors.findIndex((v: MockVendorProfile) => v.user_id === userId)
  
  if (existingVendorIndex !== -1) {
    // Update existing vendor
    const updatedVendor = {
      ...vendors[existingVendorIndex],
      ...profileData,
      updated_at: new Date().toISOString(),
    }
    
    vendors[existingVendorIndex] = updatedVendor
    localStorage.setItem('vendors', JSON.stringify(vendors))
    
    return updatedVendor
  } else {
    // Create new vendor
    const newVendor: MockVendorProfile = {
      id: Date.now().toString(),
      user_id: userId,
      vendor_name: profileData.vendor_name || '',
      farm_name: profileData.farm_name || profileData.vendor_name || '',
      owner_name: profileData.owner_name || '',
      location: profileData.location || null,
      specialty: profileData.specialty || null,
      description: profileData.description || null,
      image_url: profileData.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    const updatedVendors = [...vendors, newVendor]
    localStorage.setItem('vendors', JSON.stringify(updatedVendors))
    
    return newVendor
  }
}
