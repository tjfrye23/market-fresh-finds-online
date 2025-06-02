import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Loader2,
  MapPin,
  Star,
  Store,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'
import { mockUsers } from '@/data/mockData'

const VendorDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Find vendor from mock users
      const foundVendor = mockUsers.find(user => user.id === id && user.role === 'vendor')
      setVendor(foundVendor)
      setLoading(false)
    }
  }, [id])

  // Default image if none provided
  const defaultImage =
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-market-green mb-4" />
            <p className="text-lg">Loading vendor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If vendor not found
  if (!vendor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Vendor Not Found
            </h1>
            <p className="text-lg mb-6">
              We couldn't find the vendor you're looking for.
            </p>
            <Link to="/vendors">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Back to All Vendors
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById('vendor-products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="h-64 md:h-96 w-full relative">
          <img
            src={defaultImage}
            alt={vendor.fullName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto -mt-16 relative z-10">
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle className="text-3xl font-display text-gray-900">
                      {vendor.fullName}
                    </CardTitle>
                    <CardDescription className="text-xl mt-1">
                      Vendor Profile
                    </CardDescription>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="flex items-center text-yellow-500 mr-2">
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <span className="text-gray-600">(5.0)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <span>California</span>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <Store className="h-5 w-5 text-green-600 mr-2" />
                  <span>Email: {vendor.email}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    About {vendor.fullName}
                  </h3>
                  <p className="text-gray-700">
                    {vendor.fullName} is a dedicated vendor committed to providing high-quality products and excellent customer service. With years of experience in the marketplace, they maintain strong relationships with customers and focus on sustainable business practices.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 my-6">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={scrollToProducts}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View Products
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Stats */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Vendor Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$12,450</div>
                    <p className="text-sm text-gray-500">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Products Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">287</div>
                    <p className="text-sm text-gray-500">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customer Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">4.9</div>
                    <p className="text-sm text-gray-500">Average rating</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Products Section */}
            <div id="vendor-products" className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Available Products
              </h2>

              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">
                  No products available from this vendor yet.
                </p>
                <Link to="/shop">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default VendorDetails
