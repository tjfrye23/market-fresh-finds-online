
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
  User,
  Mail,
  ShoppingBag,
  Calendar,
} from 'lucide-react'
import { mockUsers } from '@/data/mockData'

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Find customer from mock users
      const foundCustomer = mockUsers.find(user => user.id === id && user.role === 'user')
      setCustomer(foundCustomer)
      setLoading(false)
    }
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-market-green mb-4" />
            <p className="text-lg">Loading customer profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If customer not found
  if (!customer) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Customer Not Found
            </h1>
            <p className="text-lg mb-6">
              We couldn't find the customer you're looking for.
            </p>
            <Link to="/admin/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Back to Admin Dashboard
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="mb-4">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle className="text-3xl font-display text-gray-900">
                      {customer.fullName}
                    </CardTitle>
                    <CardDescription className="text-xl mt-1">
                      Customer Profile
                    </CardDescription>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active Customer
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="flex items-center text-gray-600 mb-4">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <span>Customer ID: {customer.id}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Mail className="h-5 w-5 text-green-600 mr-2" />
                  <span>Email: {customer.email}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <span>Location: California</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    About {customer.fullName}
                  </h3>
                  <p className="text-gray-700">
                    {customer.fullName} is a valued customer who has been part of our marketplace community. 
                    They maintain an active account and regularly engage with our platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Stats */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Customer Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-sm text-gray-500">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$1,450</div>
                    <p className="text-sm text-gray-500">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Member Since</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">2024</div>
                    <p className="text-sm text-gray-500">Registration year</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Recent Orders
              </h2>

              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">
                  No recent orders found for this customer.
                </p>
                <Link to="/admin/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    View All Orders
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

export default CustomerDetails
