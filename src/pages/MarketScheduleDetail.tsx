
import { useParams, useNavigate } from 'react-router-dom'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, RefreshCw, Store } from 'lucide-react'

const MarketScheduleDetail = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const { schedules } = useMarketSchedule()
  const { user } = useAuth()
  
  // Find the schedule by ID
  const schedule = schedules.find(s => s.id === scheduleId)
  
  console.log("Schedule ID from URL:", scheduleId)
  console.log("Available schedules:", schedules.map(s => s.id))
  console.log("Found schedule:", schedule)

  if (!schedule) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Market Schedule Not Found</h1>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(user?.role === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{schedule.name}</h1>
          <p className="text-gray-600">Market schedule details</p>
        </div>

        <div className="grid gap-6">
          {/* Schedule Overview */}
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
            <CardContent>
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

          {/* Schedule Status */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Status</CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Created:</span> {new Date(schedule.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MarketScheduleDetail
