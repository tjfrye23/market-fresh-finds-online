
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Globe
} from 'lucide-react'

const MarketDayDetail = () => {
  const { marketDayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { marketDays } = useMarketSchedule()

  const marketDay = marketDays.find(day => day.id === marketDayId)

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/auth" replace />
  }

  if (!marketDay) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Market Day Not Found</h1>
            <p className="text-gray-600 mb-4">The market day you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/vendor/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleBackToDashboard = () => {
    navigate('/vendor/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{marketDay.scheduleName}</h1>
              <p className="text-gray-600">Market Day Details</p>
            </div>
            <Badge variant={
              marketDay.status === 'completed' ? 'secondary' :
              marketDay.status === 'active' ? 'default' :
              marketDay.status === 'cancelled' ? 'destructive' : 'outline'
            }>
              {marketDay.status.charAt(0).toUpperCase() + marketDay.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Market Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Date</h3>
                <p className="text-gray-600">
                  {marketDay.marketDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Market Hours
                </h3>
                <p className="text-gray-600">
                  {marketDay.startTime} - {marketDay.endTime}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="text-gray-600">{marketDay.address}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                <p className="text-gray-600">{marketDay.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Online Shop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Shop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Online Shop Hours</h3>
                <p className="text-gray-600">
                  {marketDay.onlineStartTime} - {marketDay.onlineEndTime}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Online Shop Dates</h3>
                <div className="text-gray-600">
                  <p>Opens: {marketDay.onlineStartDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                  <p>Closes: {marketDay.onlineEndDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/vendor/add-products')}
                  >
                    Manage Products for this Market
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/vendor/dashboard')}
                  >
                    View Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Vendor Guidelines</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Arrive at least 30 minutes before market opening for setup</li>
                <li>• Ensure all products are properly labeled with prices</li>
                <li>• Online orders will be available for pickup during market hours</li>
                <li>• Contact market organizers if you need to cancel or modify your participation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default MarketDayDetail
