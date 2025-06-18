
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
  website?: string | null
  facebook?: string | null
  instagram?: string | null
  twitter?: string | null
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

export interface MockMarketSchedule {
  id: string
  name: string
  marketDate: Date
  startTime: string
  endTime: string
  onlineStartTime: string
  onlineEndTime: string
  onlineStartDate: Date
  onlineEndDate: Date
  address: string
  description: string
  isActive: boolean
  isRecurring: boolean
  status: 'active' | 'scheduled' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface MockMarketDay {
  id: string
  scheduleId: string
  scheduleName: string
  marketDate: Date
  startTime: string
  endTime: string
  onlineStartTime: string
  onlineEndTime: string
  onlineStartDate: Date
  onlineEndDate: Date
  address: string
  description: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  created_at: string
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
    website: 'https://greenvalleyfarm.com',
    facebook: 'greenvalleyfarm',
    instagram: '@greenvalleyfarm',
    twitter: '@greenvalley_ca',
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
    website: 'https://sunriseorchard.com',
    facebook: 'sunriseorchard',
    instagram: '@sunrise_orchard',
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
    instagram: '@coastal_herbs_ca',
    twitter: '@coastalherbs',
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
    email: 'admin@example.com',
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
    email: 'vendor@example.com',
    fullName: 'Elena Rodriguez',
    role: 'vendor',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'user@example.com',
    fullName: 'John Doe',
    role: 'user',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Helper function to get date X days from now
const getDaysFromNow = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export const mockMarketSchedules: MockMarketSchedule[] = [
  {
    id: 'schedule-1',
    name: 'Saturday Downtown Market',
    marketDate: getDaysFromNow(3), // This Saturday
    startTime: '08:00',
    endTime: '14:00',
    onlineStartTime: '00:00',
    onlineEndTime: '06:00',
    onlineStartDate: getDaysFromNow(0), // Today
    onlineEndDate: getDaysFromNow(3), // Until market day
    address: '123 Main Street, Downtown Plaza',
    description: 'Weekly farmers market in the heart of downtown featuring local vendors, fresh produce, and artisanal goods.',
    isActive: true,
    isRecurring: true,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'schedule-2',
    name: 'Sunday Riverside Market',
    marketDate: getDaysFromNow(10), // Next Sunday
    startTime: '09:00',
    endTime: '15:00',
    onlineStartTime: '00:00',
    onlineEndTime: '07:00',
    onlineStartDate: getDaysFromNow(7), // A week from now
    onlineEndDate: getDaysFromNow(10), // Until market day
    address: '456 River Road, Riverside Park',
    description: 'Family-friendly market by the river with live music, food trucks, and the best local produce.',
    isActive: true,
    isRecurring: true,
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'schedule-3',
    name: 'Wednesday Midweek Market',
    marketDate: getDaysFromNow(17), // Two Wednesdays from now
    startTime: '10:00',
    endTime: '16:00',
    onlineStartTime: '00:00',
    onlineEndTime: '08:00',
    onlineStartDate: getDaysFromNow(14), // Two weeks from now
    onlineEndDate: getDaysFromNow(17), // Until market day
    address: '789 Oak Avenue, Community Center',
    description: 'Smaller midweek market perfect for picking up fresh ingredients and specialty items.',
    isActive: true,
    isRecurring: true,
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockMarketDays: MockMarketDay[] = [
  {
    id: 'market-day-1',
    scheduleId: 'schedule-1',
    scheduleName: 'Saturday Downtown Market',
    marketDate: getDaysFromNow(3),
    startTime: '08:00',
    endTime: '14:00',
    onlineStartTime: '00:00',
    onlineEndTime: '06:00',
    onlineStartDate: getDaysFromNow(0),
    onlineEndDate: getDaysFromNow(3),
    address: '123 Main Street, Downtown Plaza',
    description: 'Weekly farmers market in the heart of downtown featuring local vendors, fresh produce, and artisanal goods.',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'market-day-2',
    scheduleId: 'schedule-1',
    scheduleName: 'Saturday Downtown Market',
    marketDate: getDaysFromNow(10),
    startTime: '08:00',
    endTime: '14:00',
    onlineStartTime: '00:00',
    onlineEndTime: '06:00',
    onlineStartDate: getDaysFromNow(7),
    onlineEndDate: getDaysFromNow(10),
    address: '123 Main Street, Downtown Plaza',
    description: 'Weekly farmers market in the heart of downtown featuring local vendors, fresh produce, and artisanal goods.',
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'market-day-3',
    scheduleId: 'schedule-2',
    scheduleName: 'Sunday Riverside Market',
    marketDate: getDaysFromNow(11),
    startTime: '09:00',
    endTime: '15:00',
    onlineStartTime: '00:00',
    onlineEndTime: '07:00',
    onlineStartDate: getDaysFromNow(8),
    onlineEndDate: getDaysFromNow(11),
    address: '456 River Road, Riverside Park',
    description: 'Family-friendly market by the river with live music, food trucks, and the best local produce.',
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'market-day-4',
    scheduleId: 'schedule-2',
    scheduleName: 'Sunday Riverside Market',
    marketDate: getDaysFromNow(18),
    startTime: '09:00',
    endTime: '15:00',
    onlineStartTime: '00:00',
    onlineEndTime: '07:00',
    onlineStartDate: getDaysFromNow(15),
    onlineEndDate: getDaysFromNow(18),
    address: '456 River Road, Riverside Park',
    description: 'Family-friendly market by the river with live music, food trucks, and the best local produce.',
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'market-day-5',
    scheduleId: 'schedule-3',
    scheduleName: 'Wednesday Midweek Market',
    marketDate: getDaysFromNow(19),
    startTime: '10:00',
    endTime: '16:00',
    onlineStartTime: '00:00',
    onlineEndTime: '08:00',
    onlineStartDate: getDaysFromNow(16),
    onlineEndDate: getDaysFromNow(19),
    address: '789 Oak Avenue, Community Center',
    description: 'Smaller midweek market perfect for picking up fresh ingredients and specialty items.',
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'market-day-6',
    scheduleId: 'schedule-3',
    scheduleName: 'Wednesday Midweek Market',
    marketDate: getDaysFromNow(26),
    startTime: '10:00',
    endTime: '16:00',
    onlineStartTime: '00:00',
    onlineEndTime: '08:00',
    onlineStartDate: getDaysFromNow(23),
    onlineEndDate: getDaysFromNow(26),
    address: '789 Oak Avenue, Community Center',
    description: 'Smaller midweek market perfect for picking up fresh ingredients and specialty items.',
    status: 'scheduled',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Initialize market day products in localStorage for market-day-1
const initializeMarketDayProducts = () => {
  const marketDayProducts = [
    {
      productId: '1',
      productName: 'Organic Kale',
      productPrice: 3.50,
      productUnit: 'bunch',
      productImage: 'https://images.unsplash.com/photo-1515363578674-99828b5a8b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      quantity: 10,
      packageSize: '1',
      prepackaged: true,
      packageId: 'pkg-kale-1'
    },
    {
      productId: '2',
      productName: 'Heirloom Tomatoes',
      productPrice: 6.00,
      productUnit: 'lb',
      productImage: 'https://images.unsplash.com/photo-1546470427-e212b9d57d84?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      quantity: 15,
      packageSize: '2',
      prepackaged: true,
      packageId: 'pkg-tomatoes-1'
    },
    {
      productId: '3',
      productName: 'Fresh Peaches',
      productPrice: 4.50,
      productUnit: 'lb',
      productImage: 'https://images.unsplash.com/photo-1594736797933-d0a9ba10b3b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      quantity: 20,
      packageSize: '3',
      prepackaged: true,
      packageId: 'pkg-peaches-1'
    },
    {
      productId: '4',
      productName: 'Fresh Basil',
      productPrice: 2.50,
      productUnit: 'bunch',
      productImage: 'https://images.unsplash.com/photo-1618164435735-413ae8126cb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      quantity: 25,
      packageSize: '1',
      prepackaged: true,
      packageId: 'pkg-basil-1'
    }
  ]
  
  // Only set if not already exists to avoid overwriting user data
  if (!localStorage.getItem('market_day_products_market-day-1')) {
    localStorage.setItem('market_day_products_market-day-1', JSON.stringify(marketDayProducts))
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeMarketDayProducts()
}
