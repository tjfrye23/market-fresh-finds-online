import { useParams, useNavigate } from 'react-router-dom'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Calendar, Clock, RefreshCw, Store, Settings, Edit, Save, X, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const editScheduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  marketDate: z.string().min(1, "Market date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  onlineStartTime: z.string().min(1, "Online start time is required"),
  onlineEndTime: z.string().min(1, "Online end time is required"),
  onlineStartDate: z.string().min(1, "Online start date is required"),
  onlineEndDate: z.string().min(1, "Online end date is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  isRecurring: z.boolean(),
})

type EditScheduleFormData = z.infer<typeof editScheduleSchema>

const MarketScheduleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    schedules, 
    updateSchedule, 
    deleteSchedule, 
    subscribeToSchedule, 
    unsubscribeFromSchedule, 
    isVendorSubscribed 
  } = useMarketSchedule()
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  
  console.log("Schedule ID from URL:", id)
  console.log("Available schedules:", schedules.map(s => ({ id: s.id, name: s.name })))
  
  // Find the schedule by ID
  const schedule = schedules.find(s => s.id === id)
  
  console.log("Found schedule:", schedule)

  const isSubscribed = user?.role === 'vendor' && user.id && schedule 
    ? isVendorSubscribed(user.id, schedule.id) 
    : false

  const form = useForm<EditScheduleFormData>({
    resolver: zodResolver(editScheduleSchema),
    defaultValues: {
      name: schedule?.name || '',
      marketDate: schedule?.marketDate ? schedule.marketDate.toISOString().split('T')[0] : '',
      startTime: schedule?.startTime || '',
      endTime: schedule?.endTime || '',
      onlineStartTime: schedule?.onlineStartTime || '',
      onlineEndTime: schedule?.onlineEndTime || '',
      onlineStartDate: schedule?.onlineStartDate ? schedule.onlineStartDate.toISOString().split('T')[0] : '',
      onlineEndDate: schedule?.onlineEndDate ? schedule.onlineEndDate.toISOString().split('T')[0] : '',
      address: schedule?.address || '',
      description: schedule?.description || '',
      isActive: schedule?.isActive || false,
      isRecurring: schedule?.isRecurring || false,
    }
  })

  if (!schedule) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-left">
            <h1 className="text-2xl font-bold mb-4">Market Schedule Not Found</h1>
            <p className="text-gray-600 mb-4">
              Could not find market schedule with ID: {id}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Available schedule IDs: {schedules.map(s => s.id).join(', ')}
            </p>
            <Button onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const handleStatusChange = (newStatus: 'pending review' | 'approved' | 'rejected') => {
    updateSchedule(schedule.id, { status: newStatus })
    toast({
      title: "Status Updated",
      description: `Market schedule status changed to ${newStatus}`,
    })
  }

  const handleSubscribe = () => {
    if (user?.id && schedule) {
      subscribeToSchedule(user.id, schedule.id)
      toast({
        title: "Subscribed",
        description: `You are now subscribed to ${schedule.name}`,
      })
    }
  }

  const handleUnsubscribe = () => {
    if (user?.id && schedule) {
      unsubscribeFromSchedule(user.id, schedule.id)
      toast({
        title: "Unsubscribed",
        description: `You have unsubscribed from ${schedule.name}`,
      })
    }
  }

  const onSubmit = (data: EditScheduleFormData) => {
    updateSchedule(schedule.id, {
      name: data.name,
      marketDate: new Date(data.marketDate),
      startTime: data.startTime,
      endTime: data.endTime,
      onlineStartTime: data.onlineStartTime,
      onlineEndTime: data.onlineEndTime,
      onlineStartDate: new Date(data.onlineStartDate),
      onlineEndDate: new Date(data.onlineEndDate),
      address: data.address,
      description: data.description,
      isActive: data.isActive,
      isRecurring: data.isRecurring,
    })
    
    setIsEditing(false)
    toast({
      title: "Schedule Updated",
      description: "Market schedule has been successfully updated",
    })
  }

  const handleCancelEdit = () => {
    form.reset()
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteSchedule(schedule.id)
    toast({
      title: "Schedule Deleted",
      description: "Market schedule has been successfully deleted",
    })
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-4 text-left">
              <Button 
                variant="outline" 
                onClick={() => navigate(user?.role === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard')}
                className="self-start"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{schedule.name}</h1>
                <p className="text-gray-600">Market schedule details</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Vendor Subscription Controls */}
              {user?.role === 'vendor' && schedule.status === 'approved' && (
                <>
                  {isSubscribed ? (
                    <Button onClick={handleUnsubscribe} variant="outline">
                      Unsubscribe
                    </Button>
                  ) : (
                    <Button onClick={handleSubscribe}>
                      Subscribe to Market
                    </Button>
                  )}
                </>
              )}
              
              {/* Admin Controls */}
              {isAdmin && !isEditing && (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Schedule
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Schedule
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Market Schedule</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{schedule.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Status for Vendors */}
        {user?.role === 'vendor' && schedule.status === 'approved' && (
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <p className="font-medium">Subscription Status</p>
                    <p className="text-sm text-gray-600">
                      {isSubscribed 
                        ? "You are subscribed to this market schedule" 
                        : "Subscribe to receive market days and participate in this market"
                      }
                    </p>
                  </div>
                  <Badge variant={isSubscribed ? "default" : "secondary"}>
                    {isSubscribed ? "Subscribed" : "Not Subscribed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Warning for non-approved schedules */}
        {schedule.status !== 'approved' && (
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-amber-600 text-left">
                  <Badge variant="secondary">{schedule.status}</Badge>
                  <p className="text-sm">
                    This market schedule is {schedule.status} and not available for subscription.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6">
          {/* Edit Form */}
          {isEditing && isAdmin && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Edit Market Schedule</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Market Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="marketDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Market Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="onlineStartDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Online Start Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="onlineEndDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Online End Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="onlineStartTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Online Start Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="onlineEndTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Online End Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  Active
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isRecurring"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  Recurring
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Schedule Overview - only show when not editing */}
          {!isEditing && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Overview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(schedule.status)}>
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </Badge>
                    {schedule.isRecurring && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Market Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Date:</span> {schedule.marketDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                      {schedule.address && (
                        <div>
                          <span className="font-medium">Address:</span> {schedule.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Online Shop Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Period:</span> {schedule.onlineStartDate.toLocaleDateString()} - {schedule.onlineEndDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {formatTime(schedule.onlineStartTime)} - {formatTime(schedule.onlineEndTime)}
                      </div>
                    </div>
                  </div>
                </div>
                {schedule.description && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{schedule.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Schedule Status - only show when not editing */}
          {!isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Schedule Status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Status</p>
                      <p className="text-sm text-gray-600">This schedule is currently {schedule.status}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(schedule.status)} className="text-sm">
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Admin Status Change Control */}
                  {isAdmin && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Change Status</p>
                          <p className="text-sm text-gray-600">Update the approval status of this market schedule</p>
                        </div>
                        <Select value={schedule.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending review">Pending Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Created:</span> {new Date(schedule.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MarketScheduleDetail
