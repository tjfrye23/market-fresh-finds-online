
import React, { useState } from 'react'
import { useMarketSchedule, MarketSchedule } from '@/contexts/MarketScheduleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Clock, Calendar as CalendarIcon, RefreshCw, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

const MarketScheduleManager = () => {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, getNextMarketInfo } = useMarketSchedule()
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

  const marketInfo = getNextMarketInfo()

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

  const handleDelete = (id: string) => {
    deleteSchedule(id)
    toast.success('Schedule deleted successfully')
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Market Schedule</h2>
          <p className="text-gray-600">Manage market schedules and shop availability</p>
        </div>
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

      {marketInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Schedule Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Next Market</p>
                <p className="font-medium">
                  {marketInfo.nextMarket ? marketInfo.nextMarket.toLocaleDateString() : 'No upcoming market'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Online Opens</p>
                <p className="font-medium">
                  {marketInfo.opensAt ? marketInfo.opensAt.toLocaleString() : 'Not scheduled'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Online Closes</p>
                <p className="font-medium">
                  {marketInfo.closesAt ? marketInfo.closesAt.toLocaleString() : 'Not scheduled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No market schedules configured</p>
                <p className="text-sm text-gray-400">Add a schedule to control shop availability</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          schedules.map(schedule => (
            <Card key={schedule.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{schedule.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(schedule.status)}>
                          {schedule.status}
                        </Badge>
                        {schedule.isRecurring && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                    </div>
                    {schedule.address && (
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {schedule.address}
                      </p>
                    )}
                    {schedule.description && (
                      <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {schedule.marketDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Market:</span> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                      <div>
                        <span className="font-medium">Start Time:</span> {formatTime(schedule.onlineStartTime)}
                      </div>
                      <div>
                        <span className="font-medium">End Time:</span> {formatTime(schedule.onlineEndTime)}
                      </div>
                    </div>
                    {schedule.onlineStartDate && schedule.onlineEndDate && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Online Period:</span> {schedule.onlineStartDate.toLocaleDateString()} - {schedule.onlineEndDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default MarketScheduleManager
