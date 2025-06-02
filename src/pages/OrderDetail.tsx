import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, ArrowRight } from 'lucide-react'
import { getVendorOrders } from '@/services/vendorService'
import { Order } from '@/services/orderService'
import { toast } from 'sonner'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'processed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const updateOrderStatus = (orderId: string, newStatus: 'processing' | 'processed') => {
  const orders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]')
  const updatedOrders = orders.map((order: Order) => 
    order.id === orderId ? { ...order, status: newStatus } : order
  )
  localStorage.setItem('marketplace_orders', JSON.stringify(updatedOrders))
  return updatedOrders.find((order: Order) => order.id === orderId)
}

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'processing' | 'processed'>('processing')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user?.id && orderId) {
      if (isAdmin) {
        // Admin can see all orders
        const allStoredOrders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]')
        const sortedOrders = allStoredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setAllOrders(sortedOrders)
        
        const foundOrder = sortedOrders.find(o => o.id === orderId)
        setOrder(foundOrder || null)
        if (foundOrder) {
          setSelectedStatus(foundOrder.status)
        }
        setLoading(false)
      } else {
        // Vendor can only see their orders
        getVendorOrders(user.id).then(orders => {
          const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setAllOrders(sortedOrders)
          
          const foundOrder = sortedOrders.find(o => o.id === orderId)
          setOrder(foundOrder || null)
          if (foundOrder) {
            setSelectedStatus(foundOrder.status)
          }
          setLoading(false)
        }).catch(error => {
          console.error('Error loading order:', error)
          setLoading(false)
        })
      }
    }
  }, [user, orderId, isAdmin])

  const handleStatusUpdate = async () => {
    if (!order || !orderId) return
    
    setIsUpdating(true)
    try {
      const updatedOrder = updateOrderStatus(orderId, selectedStatus)
      if (updatedOrder) {
        setOrder(updatedOrder)
        toast.success('Order status updated successfully')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNextOrder = () => {
    if (!order || allOrders.length === 0) return
    
    const currentIndex = allOrders.findIndex(o => o.id === order.id)
    if (currentIndex !== -1 && currentIndex < allOrders.length - 1) {
      const nextOrder = allOrders[currentIndex + 1]
      const basePath = isAdmin ? '/admin/orders' : '/vendor/orders'
      navigate(`${basePath}/${nextOrder.id}`)
    }
  }

  const getNextOrderAvailable = () => {
    if (!order || allOrders.length === 0) return false
    
    const currentIndex = allOrders.findIndex(o => o.id === order.id)
    return currentIndex !== -1 && currentIndex < allOrders.length - 1
  }

  const getBackPath = () => {
    return isAdmin ? '/admin/dashboard' : '/vendor/dashboard'
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading order details...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(getBackPath())}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isNextOrderAvailable = getNextOrderAvailable()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(getBackPath())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={handleNextOrder}
              disabled={!isNextOrderAvailable}
              className={!isNextOrderAvailable ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Next Order
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details - {order.orderNumber}</h1>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Order Status and Date */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update Section */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select value={selectedStatus} onValueChange={(value: 'processing' | 'processed') => setSelectedStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={isUpdating || selectedStatus === order.status}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.customerInfo.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.farmName && (
                        <p className="text-sm text-gray-600">from {item.farmName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)} × {item.quantity}</p>
                      <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderDetail
