
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Package, Calendar, DollarSign } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { getUserOrders, Order } from '@/services/orderService'

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

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user?.email) {
      const userOrders = getUserOrders(user.email)
      setOrders(userOrders)
    }
  }, [user])

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and view your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <Button onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Accordion type="multiple" className="w-full space-y-4">
              {orders.map((order) => (
                <AccordionItem key={order.id} value={order.id} className="border rounded-lg">
                  <Card className="w-full">
                    <AccordionTrigger className="hover:no-underline">
                      <CardHeader className="pb-4 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                          <div className="text-left">
                            <CardTitle className="text-lg font-semibold">
                              Order {order.orderNumber}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <div className="flex items-center text-lg font-bold text-market-green-dark">
                              <DollarSign className="w-4 h-4" />
                              {order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex-grow text-left">
                                <p className="font-medium text-left">{item.name}</p>
                                {item.farmName && (
                                  <p className="text-sm text-gray-500 text-left">from {item.farmName}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                <p className="font-semibold">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Orders
