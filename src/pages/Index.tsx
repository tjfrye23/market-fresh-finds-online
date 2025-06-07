import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  LeafyGreen,
  MapPin,
  Truck,
} from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { Product } from '@/components/product/types'
import { Loader2 } from 'lucide-react'
import { getMarketplaceProducts } from '@/services/mockServices'

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products from database and select random products for featured section
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const data = await getMarketplaceProducts()

        // If products are available, randomly select up to 4 for the featured section
        if (data && data.length > 0) {
          // Shuffle the array
          const shuffled = [...data].sort(() => 0.5 - Math.random())
          // Get the first 4 items or all if less than 4
          const randomProducts = shuffled.slice(0, Math.min(4, shuffled.length))
          setFeaturedProducts(randomProducts)
        } else {
          // Fallback to sample products if no products in database
          setFeaturedProducts(sampleFeaturedProducts)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setFeaturedProducts(sampleFeaturedProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Sample featured products as fallback
  const sampleFeaturedProducts: Product[] = [
    {
      id: '1',
      name: 'Organic Strawberries',
      price: 4.99,
      unit: '1 lb package',
      image:
        'https://images.unsplash.com/photo-1518635017480-d9a4666b3a54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      organic: true,
      local: true,
      description: null,
      category: 'fruits',
      user_id: '123',
      stock: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Fresh Avocados',
      price: 2.49,
      unit: 'Each',
      image:
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      organic: false,
      local: true,
      description: null,
      category: 'fruits',
      user_id: '123',
      stock: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Organic Kale Bunch',
      price: 3.29,
      unit: 'Bundle',
      image:
        'https://images.unsplash.com/photo-1515471949468-fec1525563f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      organic: true,
      local: false,
      description: null,
      category: 'vegetables',
      user_id: '123',
      stock: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Artisan Sourdough Bread',
      price: 5.99,
      unit: '16 oz loaf',
      image:
        'https://images.unsplash.com/photo-1585478259715-4d3f6b5a0a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      organic: false,
      local: true,
      description: null,
      category: 'bakery',
      user_id: '123',
      stock: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  // Sample categories
  const categories = [
    {
      name: 'Fruits',
      image:
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      slug: 'fruits',
    },
    {
      name: 'Vegetables',
      image:
        'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      slug: 'vegetables',
    },
    {
      name: 'Dairy & Eggs',
      image:
        'https://images.unsplash.com/photo-1630688231126-dd36840bf2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      slug: 'dairy-eggs',
    },
    {
      name: 'Bakery',
      image:
        'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      slug: 'bakery',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white text-center leading-tight mb-6">
              Fresh from Our Fields
              <br />
              to Your Table
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl text-center mb-8">
              Your local source for farm-fresh produce, artisanal products, and
              community connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link to="/vendors" className="btn-secondary">
                Meet Our Vendors
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-market-gray-light">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title">Featured Products</h2>
              <Link
                to="/shop"
                className="text-market-green-dark hover:text-market-green flex items-center transition-colors"
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-market-green" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    image={product.image || ''}
                    organic={product.organic || false}
                    local={product.local || false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-market-green text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Stay Connected
            </h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for seasonal recipes, market updates,
              and exclusive offers.
            </p>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-md flex-grow text-gray-900 focus:outline-none focus:ring-2 focus:ring-market-yellow"
                />
                <button
                  type="submit"
                  className="btn-secondary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Index
