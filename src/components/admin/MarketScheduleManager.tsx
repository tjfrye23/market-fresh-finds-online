
import React, { useState } from 'react'
import { useMarketSchedule, MarketSchedule } from '@/contexts/MarketScheduleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Clock, Calendar } from 'lucide-react'
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
    marketTime: '',
    openDaysBefore: '',
    closeHoursAfter: '',
    isActive: true
  })

  const marketInfo = getNextMarketInfo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.dayOfWeek || !formData.marketTime || !formData.openDaysBefore || !formData.closeHoursAfter) {
      toast.error('Please fill in all fields')
      return
    }

    addSchedule({
      name: formData.name,
      dayOfWeek: parseInt(formData.dayOfWeek),
      marketTime: formData.marketTime,
      openDaysBefore: parseInt(formData.openDaysBefore),
      closeHoursAfter: parseInt(formData.closeHoursAfter),
      isActive: formData.isActive
    })

    setFormData({
      name: '',
      dayOfWeek: '',
      marketTime: '',
      openDaysBefore: '',
      closeHoursAfter: '',
      isActive: true
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Market Schedule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekly Farmers Market"
                />
              </div>
              
              <div>
                <Label htmlFor="dayOfWeek">Market Day</Label>
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

              <div>
                <Label htmlFor="marketTime">Market Time</Label>
                <Input
                  id="marketTime"
                  type="time"
                  value={formData.marketTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, marketTime: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="openDaysBefore">Open Days Before Market</Label>
                <Input
                  id="openDaysBefore"
                  type="number"
                  min="0"
                  max="7"
                  value={formData.openDaysBefore}
                  onChange={(e) => setFormData(prev => ({ ...prev, openDaysBefore: e.target.value }))}
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <Label htmlFor="closeHoursAfter">Close Hours After Market</Label>
                <Input
                  id="closeHoursAfter"
                  type="number"
                  min="0"
                  max="48"
                  value={formData.closeHoursAfter}
                  onChange={(e) => setFormData(prev => ({ ...prev, closeHoursAfter: e.target.value }))}
                  placeholder="e.g., 6"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
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
                <p className="text-sm text-gray-600">Shop Opens</p>
                <p className="font-medium">
                  {marketInfo.opensAt ? marketInfo.opensAt.toLocaleDateString() : 'Not scheduled'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shop Closes</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{schedule.name}</h3>
                      <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Day:</span> {DAYS_OF_WEEK[schedule.dayOfWeek].label}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {formatTime(schedule.marketTime)}
                      </div>
                      <div>
                        <span className="font-medium">Opens:</span> {schedule.openDaysBefore} days before
                      </div>
                      <div>
                        <span className="font-medium">Closes:</span> {schedule.closeHoursAfter} hours after
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
