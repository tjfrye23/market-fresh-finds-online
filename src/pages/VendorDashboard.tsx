
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileStatusBanner from '@/components/ProfileStatusBanner'
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
  Save,
  PlusCircle,
  User
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
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { toast } from 'sonner'
import ProductList from '@/components/product/ProductList'
import ProductDialog from '@/components/product/ProductDialog'
import { Product } from '@/components/product/types'
import { useVendorProducts } from '@/hooks/useVendorProducts'

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
  const { schedules, getVendorMarketDays } = useMarketSchedule()
  const [orders, setOrders] = useState<Order[]>([])
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'processing' | 'processed'>('processing')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Product management state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data: products = [], isLoading: productsLoading } = useVendorProducts(user?.id || '')

  // Get vendor's market days
  const vendorMarketDays = user?.id ? getVendorMarketDays(user.id) : []

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

  const handleMarketDayClick = (marketDayId: string) => {
    navigate(`/vendor/market-day/${marketDayId}`)
  }

  const handleMarketScheduleClick = (scheduleId: string) => {
    navigate(`/vendor/market-schedule/${scheduleId}`)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsProductDialogOpen(true)
  }

  const resetProductForm = () => {
    setEditingProduct(null)
  }

  const handleAddNewProducts = () => {
    navigate('/vendor/add-products')
  }

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/auth" replace />
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-left">Loading dashboard...</div>
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
        <div className="mb-8 flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">Vendor Dashboard</h1>
            <p className="text-gray-600 text-left">Manage your orders and track your performance</p>
          </div>
          <Button
            onClick={() => navigate('/vendor/profile')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Manage Shop Profile
          </Button>
        </div>

        {/* Profile Status Banner */}
        <ProfileStatusBanner userId={user.id} />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-left">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-left">${metrics?.totalRevenue.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-left">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-left">{metrics?.totalOrders || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-left">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-left">${metrics?.avgOrderValue.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-left">Active Orders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-left">{currentOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        {metrics?.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left">Monthly Revenue</CardTitle>
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
            <TabsTrigger value="products">Manage Products ({products.length})</TabsTrigger>
            <TabsTrigger value="market-days">Market Days ({vendorMarketDays.length})</TabsTrigger>
            <TabsTrigger value="schedules">Market Schedules ({schedules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Current Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrders.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No current orders
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Order #</TableHead>
                        <TableHead className="text-left">Date</TableHead>
                        <TableHead className="text-left">Customer</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                        <TableHead className="text-left">Total</TableHead>
                        <TableHead className="text-left">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(order)}
                        >
                          <TableCell className="font-medium text-left">{order.orderNumber}</TableCell>
                          <TableCell className="text-left">{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-left">{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
                          <TableCell className="text-left">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-left">
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
                <CardTitle className="text-left">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {pastOrders.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No completed orders yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Order #</TableHead>
                        <TableHead className="text-left">Date</TableHead>
                        <TableHead className="text-left">Customer</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                        <TableHead className="text-left">Total</TableHead>
                        <TableHead className="text-left">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastOrders.map((order) => (
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(order)}
                        >
                          <TableCell className="font-medium text-left">{order.orderNumber}</TableCell>
                          <TableCell className="text-left">{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-left">{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
                          <TableCell className="text-left">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-left">
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

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-left">Your Products</CardTitle>
                  <Button
                    onClick={handleAddNewProducts}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add New Products
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  isLoading={productsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market-days">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Your Market Days</CardTitle>
                <p className="text-sm text-gray-600 text-left">
                  Market days from schedules you're subscribed to (next 4 weeks)
                </p>
              </CardHeader>
              <CardContent>
                {vendorMarketDays.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    <div className="mb-4">
                      <Calendar className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="mb-2 text-left">No upcoming market days</p>
                    <p className="text-sm text-left">Subscribe to market schedules to see your market days here.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Market Name</TableHead>
                        <TableHead className="text-left">Date</TableHead>
                        <TableHead className="text-left">Market Hours</TableHead>
                        <TableHead className="text-left">Online Hours</TableHead>
                        <TableHead className="text-left">Address</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorMarketDays.map((marketDay) => (
                        <TableRow 
                          key={marketDay.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleMarketDayClick(marketDay.id)}
                        >
                          <TableCell className="font-medium text-left">{marketDay.scheduleName}</TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm">
                              <div>{marketDay.marketDate.toLocaleDateString()}</div>
                              <div className="text-gray-500">{marketDay.marketDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm">
                              {marketDay.startTime} - {marketDay.endTime}
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm">
                              <div>{marketDay.onlineStartTime} - {marketDay.onlineEndTime}</div>
                              <div className="text-gray-500">
                                {marketDay.onlineStartDate.toLocaleDateString()} - {marketDay.onlineEndDate.toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm max-w-xs">
                              {marketDay.address}
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <Badge variant={
                              marketDay.status === 'completed' ? 'secondary' :
                              marketDay.status === 'active' ? 'default' :
                              marketDay.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {marketDay.status.charAt(0).toUpperCase() + marketDay.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Market Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No market schedules found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Schedule Name</TableHead>
                        <TableHead className="text-left">Market Date</TableHead>
                        <TableHead className="text-left">Market Hours</TableHead>
                        <TableHead className="text-left">Address</TableHead>
                        <TableHead className="text-left">Online Opens</TableHead>
                        <TableHead className="text-left">Online Closes</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow 
                          key={schedule.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleMarketScheduleClick(schedule.id)}
                        >
                          <TableCell className="font-medium text-left">{schedule.name}</TableCell>
                          <TableCell className="text-left">{schedule.marketDate.toLocaleDateString()}</TableCell>
                          <TableCell className="text-left">
                            {schedule.startTime} - {schedule.endTime}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm max-w-xs">
                              {schedule.address}
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm">
                              <div>{schedule.onlineStartDate.toLocaleDateString()}</div>
                              <div className="text-gray-500">{schedule.onlineStartTime}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="text-sm">
                              <div>{schedule.onlineEndDate.toLocaleDateString()}</div>
                              <div className="text-gray-500">{schedule.onlineEndTime}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <Badge variant={schedule.status === 'approved' ? 'default' : schedule.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </Badge>
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
              <DialogTitle className="text-left">Update Order Status</DialogTitle>
              <DialogDescription className="text-left">
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

        {/* Product Edit Dialog */}
        <ProductDialog
          isOpen={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
          editingProduct={editingProduct}
          onResetForm={resetProductForm}
        />
      </main>
      <Footer />
    </div>
  )
}

export default VendorDashboard
