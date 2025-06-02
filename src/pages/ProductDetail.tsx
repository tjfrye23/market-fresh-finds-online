
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, MapPin, Leaf, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getMarketplaceProducts, getVendorByUserId } from '@/services/mockServices'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getMarketplaceProducts,
  })

  const product = products.find(p => p.id === id)

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', product?.user_id],
    queryFn: () => product ? getVendorByUserId(product.user_id) : null,
    enabled: !!product?.user_id,
  })

  if (productsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="page-container py-8">
          <Link to="/shop" className="inline-flex items-center text-market-green hover:text-market-green-dark mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.organic && (
                  <Badge className="bg-market-green text-white">
                    <Leaf className="mr-1 h-3 w-3" />
                    Organic
                  </Badge>
                )}
                {product.local && (
                  <Badge className="bg-market-yellow text-market-brown-dark">
                    <MapPin className="mr-1 h-3 w-3" />
                    Local
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xl text-market-green-dark font-semibold mb-4">
                ${product.price.toFixed(2)} per {product.unit}
              </p>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {vendor && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    From {vendor.vendor_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Owner: {vendor.owner_name}
                  </p>
                  {vendor.location && (
                    <p className="text-sm text-gray-600 mb-2">
                      Location: {vendor.location}
                    </p>
                  )}
                  {vendor.specialty && (
                    <p className="text-sm text-gray-600">
                      Specialty: {vendor.specialty}
                    </p>
                  )}
                </div>
              )}

              <Button 
                size="lg" 
                className="bg-market-green hover:bg-market-green-dark text-white w-full sm:w-auto"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetail
