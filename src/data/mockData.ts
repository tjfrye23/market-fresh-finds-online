
export interface MockUser {
  id: string
  email: string
  fullName: string
  role: 'user' | 'vendor' | 'admin'
  app_metadata: any
  user_metadata: any
  aud?: string
  created_at?: string
}

export interface MockVendorProfile {
  id: string
  user_id: string
  vendor_name: string
  owner_name: string
  location: string | null
  specialty: string | null
  description: string | null
  image_url: string | null
  status: 'active' | 'pending' | 'rejected'
  created_at: string
  updated_at: string
}

export interface MockProduct {
  id: string
  user_id: string
  name: string
  price: number
  unit: string
  category: string
  description: string | null
  image: string | null
  organic: boolean
  local: boolean
  stock: number
  created_at: string
  updated_at: string
}

export const mockVendors: MockVendorProfile[] = [
  {
    id: '1',
    user_id: 'vendor1',
    vendor_name: 'Green Valley Farm',
    owner_name: 'Sarah Johnson',
    location: 'Sonoma County, CA',
    specialty: 'Organic Vegetables',
    description: 'Family-owned organic farm specializing in seasonal vegetables and herbs. We use sustainable farming practices and have been serving the community for over 20 years.',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'vendor2',
    vendor_name: 'Sunrise Orchard',
    owner_name: 'Mike Chen',
    location: 'Central Valley, CA',
    specialty: 'Stone Fruits',
    description: 'Third-generation fruit growers specializing in peaches, plums, and apricots. Our orchard uses integrated pest management and sustainable water practices.',
    image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'vendor3',
    vendor_name: 'Coastal Herbs',
    owner_name: 'Elena Rodriguez',
    location: 'Monterey Bay, CA',
    specialty: 'Culinary Herbs',
    description: 'Boutique herb farm focusing on rare and specialty culinary herbs. We grow everything from basil varieties to edible flowers.',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockProducts: MockProduct[] = [
  {
    id: '1',
    user_id: 'vendor1',
    name: 'Organic Kale',
    price: 3.50,
    unit: 'bunch',
    category: 'vegetables',
    description: 'Fresh curly kale, harvested this morning',
    image: 'https://images.unsplash.com/photo-1515363578674-99828b5a8b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    organic: true,
    local: true,
    stock: 15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'vendor1',
    name: 'Heirloom Tomatoes',
    price: 6.00,
    unit: 'lb',
    category: 'vegetables',
    description: 'Mixed variety heirloom tomatoes',
    image: 'https://images.unsplash.com/photo-1546470427-e212b9d57d84?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    organic: true,
    local: true,
    stock: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'vendor2',
    name: 'Fresh Peaches',
    price: 4.50,
    unit: 'lb',
    category: 'fruits',
    description: 'Sweet, juicy peaches perfect for eating fresh',
    image: 'https://images.unsplash.com/photo-1594736797933-d0a9ba10b3b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    organic: false,
    local: true,
    stock: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: 'vendor3',
    name: 'Fresh Basil',
    price: 2.50,
    unit: 'bunch',
    category: 'herbs',
    description: 'Aromatic sweet basil, perfect for cooking',
    image: 'https://images.unsplash.com/photo-1618164435735-413ae8126cb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    organic: true,
    local: true,
    stock: 20,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockUsers: MockUser[] = [
  {
    id: 'vendor1',
    email: 'test@example.com',
    fullName: 'Thomas',
    role: 'admin',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vendor2',
    email: 'mike@sunriseorchard.com',
    fullName: 'Mike Chen',
    role: 'vendor',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vendor3',
    email: 'elena@coastalherbs.com',
    fullName: 'Elena Rodriguez',
    role: 'vendor',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: 'user',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  }
]
