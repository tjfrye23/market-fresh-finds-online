
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'
import { getVendorOrders } from '@/services/vendorService'
import { Order } from '@/services/orderService'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && orderId) {
      getVendorOrders(user.id).then(orders => {
        const foundOrder = orders.find(o => o.id === orderId)
        setOrder(foundOrder || null)
        setLoading(false)
      }).catch(error => {
        console.error('Error loading order:', error)
        setLoading(false)
      })
    }
  }, [user, orderId])

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
            <Button onClick={() => navigate('/vendor/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/vendor/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
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
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
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

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700">
                <p>{order.customerInfo.address}</p>
                <p>{order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}</p>
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
