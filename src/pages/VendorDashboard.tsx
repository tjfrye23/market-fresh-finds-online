import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Calendar,
  Eye
} from 'lucide-react'
import { getVendorOrders, getVendorMetrics } from '@/services/vendorService'
import { Order } from '@/services/orderService'

interface VendorMetrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

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

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#22c55e',
  },
}

const VendorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        getVendorOrders(user.id),
        getVendorMetrics(user.id)
      ]).then(([ordersData, metricsData]) => {
        setOrders(ordersData)
        setMetrics(metricsData)
        setLoading(false)
      }).catch(error => {
        console.error('Error loading vendor data:', error)
        setLoading(false)
      })
    }
  }, [user])

  const handleViewOrder = (order: Order) => {
    navigate(`/vendor/orders/${order.id}`)
  }

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/auth" replace />
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentOrders = orders.filter(order => 
    order.status === 'processing' || order.status === 'shipped'
  )
  const pastOrders = orders.filter(order => order.status === 'delivered')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your orders and track your performance</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics?.totalRevenue.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalOrders || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics?.avgOrderValue.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        {metrics?.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.monthlyRevenue}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Orders Tabs */}
        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Orders ({currentOrders.length})</TabsTrigger>
            <TabsTrigger value="history">Order History ({pastOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Current Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No current orders
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {pastOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No completed orders yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

export default VendorDashboard
