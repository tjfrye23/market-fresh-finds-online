
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
  Eye,
  MoreHorizontal,
  Edit,
  Save
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getVendorOrders, getVendorMetrics } from '@/services/vendorService'
import { Order } from '@/services/orderService'
import { toast } from 'sonner'

interface VendorMetrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

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
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'processing' | 'processed'>('processing')
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setSelectedStatus(order.status)
    setIsStatusDialogOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return
    
    setIsUpdating(true)
    try {
      const updatedOrder = updateOrderStatus(selectedOrder.id, selectedStatus)
      if (updatedOrder) {
        // Update the orders state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === selectedOrder.id ? updatedOrder : order
          )
        )
        toast.success('Order status updated successfully')
        setIsStatusDialogOpen(false)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRowClick = (order: Order) => {
    handleViewOrder(order)
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
    order.status === 'processing'
  )
  const pastOrders = orders.filter(order => order.status === 'processed')

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
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(order)}
                        >
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewOrder(order)
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order)
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(order)}
                        >
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewOrder(order)
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order)
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update the status for order {selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={isUpdating || selectedStatus === selectedOrder?.status}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}

export default VendorDashboard
