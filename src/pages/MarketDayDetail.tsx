
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
  Globe,
  Package
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface MarketDayProduct {
  productId: string
  productName: string
  productPrice: number
  productUnit: string
  productImage?: string
  quantity: number
}

const MarketDayDetail = () => {
  const { marketDayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { marketDays } = useMarketSchedule()
  const [marketDayProducts, setMarketDayProducts] = useState<MarketDayProduct[]>([])

  const marketDay = marketDays.find(day => day.id === marketDayId)

  useEffect(() => {
    const stored = localStorage.getItem(`market_day_products_${marketDayId}`)
    if (stored) {
      setMarketDayProducts(JSON.parse(stored))
    }
  }, [marketDayId])

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/auth" replace />
  }

  if (!marketDay) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-left">Market Day Not Found</h1>
            <p className="text-gray-600 mb-4 text-left">The market day you're looking for doesn't exist.</p>
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
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">{marketDay.scheduleName}</h1>
              <p className="text-gray-600 text-left">Market Day Details</p>
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
              <CardTitle className="flex items-center gap-2 text-left">
                <Calendar className="h-5 w-5" />
                Market Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-left">Date</h3>
                <p className="text-gray-600 text-left">
                  {marketDay.marketDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2 text-left">
                  <Clock className="h-4 w-4" />
                  Market Hours
                </h3>
                <p className="text-gray-600 text-left">
                  {marketDay.startTime} - {marketDay.endTime}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2 text-left">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="text-gray-600 text-left">{marketDay.address}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-left">Description</h3>
                <p className="text-gray-600 text-left">{marketDay.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Online Shop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-left">
                <Globe className="h-5 w-5" />
                Online Shop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-left">Online Shop Hours</h3>
                <p className="text-gray-600 text-left">
                  {marketDay.onlineStartTime} - {marketDay.onlineEndTime}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-left">Online Shop Dates</h3>
                <div className="text-gray-600">
                  <p className="text-left">Opens: {marketDay.onlineStartDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                  <p className="text-left">Closes: {marketDay.onlineEndDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-900 mb-2 text-left">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start"
                    onClick={() => navigate(`/vendor/market-day/${marketDayId}/products`)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products for this Market
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start"
                    onClick={() => navigate('/vendor/dashboard')}
                  >
                    View Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Day Products */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-left">
              <Package className="h-5 w-5" />
              Products for This Market Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketDayProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products added yet</h3>
                <p className="text-gray-500 mb-6">Add products from your profile to this market day.</p>
                <Button onClick={() => navigate(`/vendor/market-day/${marketDayId}/products`)}>
                  <Package className="h-4 w-4 mr-2" />
                  Add Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 text-left">
                    {marketDayProducts.length} product{marketDayProducts.length !== 1 ? 's' : ''} added
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/vendor/market-day/${marketDayId}/products`)}
                  >
                    Edit Products
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketDayProducts.map((product) => (
                    <div key={product.productId} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {product.productImage ? (
                          <img 
                            src={product.productImage} 
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-left">{product.productName}</h4>
                          <p className="text-sm text-gray-600 text-left">
                            ${product.productPrice.toFixed(2)} per {product.productUnit}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-sm text-gray-600 text-left">
                          Quantity: <span className="font-medium">{product.quantity} {product.productUnit}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-left">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 text-left">Vendor Guidelines</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li className="text-left">• Arrive at least 30 minutes before market opening for setup</li>
                <li className="text-left">• Ensure all products are properly labeled with prices</li>
                <li className="text-left">• Online orders will be available for pickup during market hours</li>
                <li className="text-left">• Contact market organizers if you need to cancel or modify your participation</li>
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
