import React, { useState } from 'react'
import { useMarketSchedule, MarketSchedule } from '@/contexts/MarketScheduleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Clock, Calendar, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

const MarketScheduleManager = () => {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, getNextMarketInfo } = useMarketSchedule()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    onlineStartTime: '',
    onlineEndTime: '',
    description: '',
    isActive: true,
    isRecurring: false
  })

  const marketInfo = getNextMarketInfo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.dayOfWeek || !formData.startTime || !formData.endTime || !formData.onlineStartTime || !formData.onlineEndTime) {
      toast.error('Please fill in all required fields')
      return
    }

    addSchedule({
      name: formData.name,
      dayOfWeek: parseInt(formData.dayOfWeek),
      startTime: formData.startTime,
      endTime: formData.endTime,
      onlineStartTime: formData.onlineStartTime,
      onlineEndTime: formData.onlineEndTime,
      description: formData.description,
      isActive: formData.isActive,
      isRecurring: formData.isRecurring
    })

    setFormData({
      name: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      onlineStartTime: '',
      onlineEndTime: '',
      description: '',
      isActive: true,
      isRecurring: false
    })
    setIsDialogOpen(false)
    toast.success('Market schedule added successfully')
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateSchedule(id, { isActive })
    toast.success(`Schedule ${isActive ? 'activated' : 'deactivated'}`)
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
          <p className="text-gray-600">Manage recurring market schedules and shop availability</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
                <Label htmlFor="dayOfWeek">Market Day *</Label>
                <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(day => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="onlineStartTime">Online Start *</Label>
                  <Input
                    id="onlineStartTime"
                    type="time"
                    value={formData.onlineStartTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, onlineStartTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="onlineEndTime">Online End *</Label>
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

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
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
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                        <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                          {schedule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
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
                    {schedule.description && (
                      <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Day:</span> {DAYS_OF_WEEK[schedule.dayOfWeek].label}
                      </div>
                      <div>
                        <span className="font-medium">Market:</span> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                      <div>
                        <span className="font-medium">Online Start:</span> {formatTime(schedule.onlineStartTime)}
                      </div>
                      <div>
                        <span className="font-medium">Online End:</span> {formatTime(schedule.onlineEndTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule.isActive}
                      onCheckedChange={(checked) => handleToggleActive(schedule.id, checked)}
                    />
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
