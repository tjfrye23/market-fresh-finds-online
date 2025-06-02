
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
  Store,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { getVendorData, getVendorProducts, updateVendorStatus } from '@/services/mockServices'
import { MockVendorProfile, MockProduct, mockUsers } from '@/data/mockData'
import { toast } from 'sonner'

const AdminVendorDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<MockVendorProfile | null>(null)
  const [products, setProducts] = useState<MockProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const vendorData = await getVendorData(id)
        setVendor(vendorData)
      } catch (error) {
        console.error('Error fetching vendor:', error)
        toast.error('Failed to load vendor data')
      } finally {
        setLoading(false)
      }
    }

    const fetchProducts = async () => {
      if (!id) return
      
      setProductsLoading(true)
      try {
        const vendorProducts = await getVendorProducts(id)
        setProducts(vendorProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load vendor products')
      } finally {
        setProductsLoading(false)
      }
    }

    fetchVendorData()
    fetchProducts()
  }, [id])

  const handleStatusChange = async (newStatus: 'active' | 'pending' | 'rejected') => {
    if (!vendor || !id) return

    try {
      await updateVendorStatus(id, newStatus)
      setVendor({ ...vendor, status: newStatus })
      toast.success(`Vendor status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating vendor status:', error)
      toast.error('Failed to update vendor status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getVendorUser = () => {
    if (!vendor) return null
    return mockUsers.find(user => user.id === vendor.user_id)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
            <p className="text-lg">Loading vendor details...</p>
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

  const vendorUser = getVendorUser()
  const vendorStatus = vendor.status || 'pending'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="mb-4">
                  ← Back to Admin Dashboard
                </Button>
              </Link>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                  <div>
                    <CardTitle className="text-3xl font-display text-gray-900">
                      {vendor.vendor_name}
                    </CardTitle>
                    <CardDescription className="text-xl mt-1">
                      Owned by {vendor.owner_name}
                    </CardDescription>
                  </div>

                  <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendorStatus)}`}>
                      {getStatusIcon(vendorStatus)}
                      {vendorStatus.charAt(0).toUpperCase() + vendorStatus.slice(1)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {vendorStatus !== 'active' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Vendor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve {vendor.vendor_name}? This will make their products visible to customers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusChange('active')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {vendorStatus !== 'rejected' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Vendor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject {vendor.vendor_name}? This will hide their products from customers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusChange('rejected')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vendor Information */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Vendor Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <User className="h-5 w-5 text-green-600 mr-3" />
                        <span>Owner: {vendor.owner_name}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 text-green-600 mr-3" />
                        <span>Location: {vendor.location || 'Not specified'}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Store className="h-5 w-5 text-green-600 mr-3" />
                        <span>Specialty: {vendor.specialty || 'General produce'}</span>
                      </div>

                      {vendorUser && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-5 w-5 text-green-600 mr-3" />
                          <span>Email: {vendorUser.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vendor Image */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Vendor Image</h3>
                    <div className="w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={vendor.image_url || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
                        alt={vendor.vendor_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">
                    {vendor.description || `${vendor.vendor_name} is a vendor on our marketplace.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Products Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-6 w-6 mr-2" />
                Products ({products.length})
              </h2>

              {productsLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>
                          ${product.price.toFixed(2)} / {product.unit}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {product.organic && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Organic
                            </span>
                          )}
                          {product.local && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Local
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Stock: {product.stock}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No products found for this vendor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminVendorDetails
