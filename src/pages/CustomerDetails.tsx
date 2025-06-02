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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Loader2,
  MapPin,
  User,
  Mail,
  ShoppingBag,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react'
import { mockUsers } from '@/data/mockData'
import { toast } from 'sonner'
import { getUserOrders } from '@/services/orderService'

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [lastOrderDate, setLastOrderDate] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      // Find customer from mock users
      const foundCustomer = mockUsers.find(user => user.id === id && user.role === 'user')
      setCustomer(foundCustomer)
      
      // Check if user is locked from localStorage
      const lockedUsers = JSON.parse(localStorage.getItem('locked_users') || '[]')
      setIsLocked(lockedUsers.includes(id))
      
      // Get customer's orders and find the last order date
      if (foundCustomer) {
        const customerOrders = getUserOrders(foundCustomer.email)
        if (customerOrders.length > 0) {
          // Sort orders by date descending and get the most recent
          const sortedOrders = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setLastOrderDate(sortedOrders[0].date)
        }
      }
      
      setLoading(false)
    }
  }, [id])

  const handleLockToggle = () => {
    const lockedUsers = JSON.parse(localStorage.getItem('locked_users') || '[]')
    
    if (!isLocked) {
      // Lock user
      if (!lockedUsers.includes(id)) {
        lockedUsers.push(id)
        localStorage.setItem('locked_users', JSON.stringify(lockedUsers))
        setIsLocked(true)
        toast.success(`${customer.fullName} has been locked`)
      }
    } else {
      // Unlock user
      const updatedLockedUsers = lockedUsers.filter(userId => userId !== id)
      localStorage.setItem('locked_users', JSON.stringify(updatedLockedUsers))
      setIsLocked(false)
      toast.success(`${customer.fullName} has been unlocked`)
    }
  }

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

                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    {/* Customer Status */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      isLocked 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                      {isLocked ? 'Locked' : 'Active'}
                    </div>
                    
                    {/* Lock/Unlock Action Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant={isLocked ? "default" : "destructive"}
                          size="sm"
                        >
                          {isLocked ? 'Unlock Customer' : 'Lock Customer'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {isLocked ? 'Unlock Customer' : 'Lock Customer'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {isLocked 
                              ? `Are you sure you want to unlock ${customer.fullName}? They will regain access to their account.`
                              : `Are you sure you want to lock ${customer.fullName}? They will lose access to their account.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleLockToggle}
                            className={isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                          >
                            {isLocked ? 'Unlock' : 'Lock'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                    They maintain an {isLocked ? 'inactive (locked)' : 'active'} account and {isLocked ? 'cannot currently engage' : 'regularly engage'} with our platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Stats */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Customer Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <CardTitle className="text-lg">Last Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {lastOrderDate ? new Date(lastOrderDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <p className="text-sm text-gray-500">Most recent</p>
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
