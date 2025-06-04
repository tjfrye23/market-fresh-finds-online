
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
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Package,
  Store,
  Plus
} from 'lucide-react'
import { mockUsers, mockVendors } from '@/data/mockData'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react'

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { schedules, marketDays, addSchedule, getUpcomingMarketDays } = useMarketSchedule()
  const [orders, setOrders] = useState([])
  const [vendors, setVendors] = useState([])
  const [customers, setCustomers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    marketDate: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    onlineStartTime: '',
    onlineEndTime: '',
    onlineStartDate: undefined as Date | undefined,
    onlineEndDate: undefined as Date | undefined,
    address: '',
    description: '',
    isRecurring: false
  })

  useEffect(() => {
    // Load data from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]')
    setOrders(storedOrders)
    
    // Use vendor profiles instead of user records
    setVendors(mockVendors)
    
    // Filter users by role for customers
    const customerUsers = mockUsers.filter(u => u.role === 'user')
    setCustomers(customerUsers)
  }, [])

  const handleOrderClick = (order) => {
    navigate(`/admin/orders/${order.id}`)
  }

  const handleVendorClick = (vendor) => {
    navigate(`/admin/vendors/${vendor.id}`)
  }

  const handleCustomerClick = (customer) => {
    navigate(`/admin/customers/${customer.id}`)
  }

  const handleMarketScheduleClick = (schedule) => {
    console.log("Navigating to schedule detail:", schedule.id)
    navigate(`/admin/market-schedule/${schedule.id}`)
  }

  const handleAddSchedule = () => {
    // Navigate to schedule creation page or open modal
    console.log("Add new schedule")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.marketDate || !formData.startTime || !formData.endTime || !formData.onlineStartTime || !formData.onlineEndTime || !formData.onlineStartDate || !formData.onlineEndDate || !formData.address) {
      toast.error('Please fill in all required fields')
      return
    }

    addSchedule({
      name: formData.name,
      marketDate: formData.marketDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      onlineStartTime: formData.onlineStartTime,
      onlineEndTime: formData.onlineEndTime,
      onlineStartDate: formData.onlineStartDate,
      onlineEndDate: formData.onlineEndDate,
      address: formData.address,
      description: formData.description,
      isActive: true,
      isRecurring: formData.isRecurring
    })

    setFormData({
      name: '',
      marketDate: undefined,
      startTime: '',
      endTime: '',
      onlineStartTime: '',
      onlineEndTime: '',
      onlineStartDate: undefined,
      onlineEndDate: undefined,
      address: '',
      description: '',
      isRecurring: false
    })
    setIsDialogOpen(false)
    toast.success('Market schedule added successfully')
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalVendors = vendors.length
  const totalCustomers = customers.length

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
      case 'scheduled':
      case 'active':
        return 'default'
      case 'rejected':
      case 'cancelled':
        return 'destructive'
      case 'completed':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const upcomingMarketDays = getUpcomingMarketDays()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your marketplace</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVendors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different admin views */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="schedules">Market Schedules</TabsTrigger>
            <TabsTrigger value="market-days">Market Days</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No orders found
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell className="font-medium text-left">{order.orderNumber}</TableCell>
                          <TableCell className="text-left">{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-left">{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
                          <TableCell className="text-left">
                            <Badge variant={order.status === 'processed' ? 'default' : 'secondary'}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                {vendors.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No vendors found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Vendor Name</TableHead>
                        <TableHead className="text-left">Owner</TableHead>
                        <TableHead className="text-left">Location</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow 
                          key={vendor.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleVendorClick(vendor)}
                        >
                          <TableCell className="font-medium text-left">{vendor.vendor_name}</TableCell>
                          <TableCell className="text-left">{vendor.owner_name}</TableCell>
                          <TableCell className="text-left">{vendor.location || 'Not specified'}</TableCell>
                          <TableCell className="text-left">
                            <Badge variant={vendor.status === 'active' ? 'default' : vendor.status === 'pending' ? 'secondary' : 'destructive'}>
                              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
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

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                {customers.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No customers found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Name</TableHead>
                        <TableHead className="text-left">Email</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow 
                          key={customer.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleCustomerClick(customer)}
                        >
                          <TableCell className="font-medium text-left">{customer.fullName}</TableCell>
                          <TableCell className="text-left">{customer.email}</TableCell>
                          <TableCell className="text-left">
                            <Badge variant="default">Active</Badge>
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
            <div className="space-y-6">
              {/* Market Schedules Table */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-left">Market Schedules</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Market Schedule</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Schedule Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Weekly Farmers Market"
                            />
                          </div>

                          <div>
                            <Label htmlFor="address">Address *</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="e.g., 123 Main Street, Downtown Plaza"
                            />
                          </div>
                          
                          <div>
                            <Label>Market Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formData.marketDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.marketDate ? format(formData.marketDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={formData.marketDate}
                                  onSelect={(date) => setFormData(prev => ({ ...prev, marketDate: date }))}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="startTime">Start Time *</Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="endTime">End Time *</Label>
                              <Input
                                id="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Online Shop Date Range *</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Start Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs",
                                        !formData.onlineStartDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-1 h-3 w-3" />
                                      {formData.onlineStartDate ? format(formData.onlineStartDate, "MMM d") : "Start"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={formData.onlineStartDate}
                                      onSelect={(date) => setFormData(prev => ({ ...prev, onlineStartDate: date }))}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label className="text-xs">End Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs",
                                        !formData.onlineEndDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-1 h-3 w-3" />
                                      {formData.onlineEndDate ? format(formData.onlineEndDate, "MMM d") : "End"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={formData.onlineEndDate}
                                      onSelect={(date) => setFormData(prev => ({ ...prev, onlineEndDate: date }))}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="onlineStartTime">Start Time *</Label>
                              <Input
                                id="onlineStartTime"
                                type="time"
                                value={formData.onlineStartTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, onlineStartTime: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="onlineEndTime">End Time *</Label>
                              <Input
                                id="onlineEndTime"
                                type="time"
                                value={formData.onlineEndTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, onlineEndTime: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Market description..."
                              rows={3}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isRecurring"
                              checked={formData.isRecurring}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: !!checked }))}
                            />
                            <Label htmlFor="isRecurring" className="flex items-center gap-2">
                              <RefreshCw className="h-4 w-4" />
                              Recurring Schedule
                            </Label>
                          </div>

                          <Button type="submit" className="w-full">Add Schedule</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                          <TableHead className="text-left">Address</TableHead>
                          <TableHead className="text-left">Market Date</TableHead>
                          <TableHead className="text-left">Market Hours</TableHead>
                          <TableHead className="text-left">Shop Hours</TableHead>
                          <TableHead className="text-left">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules.map((schedule) => (
                          <TableRow 
                            key={schedule.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleMarketScheduleClick(schedule)}
                          >
                            <TableCell className="font-medium text-left">{schedule.name}</TableCell>
                            <TableCell className="text-left">{schedule.address}</TableCell>
                            <TableCell className="text-left">{schedule.marketDate.toLocaleDateString()}</TableCell>
                            <TableCell className="text-left">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </TableCell>
                            <TableCell className="text-left">
                              {formatTime(schedule.onlineStartTime)} - {formatTime(schedule.onlineEndTime)}
                            </TableCell>
                            <TableCell className="text-left">
                              <Badge variant={getStatusBadgeVariant(schedule.status)}>
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
            </div>
          </TabsContent>

          <TabsContent value="market-days">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Market Days - Next 4 Weeks</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMarketDays.length === 0 ? (
                  <div className="text-left py-8 text-gray-500">
                    No upcoming market days found
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
                      {upcomingMarketDays.map((marketDay) => (
                        <TableRow key={marketDay.id}>
                          <TableCell className="font-medium text-left">{marketDay.scheduleName}</TableCell>
                          <TableCell className="text-left">{marketDay.marketDate.toLocaleDateString()}</TableCell>
                          <TableCell className="text-left">
                            {formatTime(marketDay.startTime)} - {formatTime(marketDay.endTime)}
                          </TableCell>
                          <TableCell className="text-left">
                            {formatTime(marketDay.onlineStartTime)} - {formatTime(marketDay.onlineEndTime)}
                          </TableCell>
                          <TableCell className="text-left">{marketDay.address}</TableCell>
                          <TableCell className="text-left">
                            <Badge variant={getStatusBadgeVariant(marketDay.status)}>
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
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard
