
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { useVendorProducts } from '@/hooks/useVendorProducts'
import { Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

interface MarketDayProduct {
  productId: string
  productName: string
  productPrice: number
  productUnit: string
  productImage?: string
  quantity: number
  packageSize: string
}

const MarketDayProducts = () => {
  const { marketDayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { marketDays } = useMarketSchedule()
  const { data: vendorProducts = [] } = useVendorProducts(user?.id || '')
  
  const [marketDayProducts, setMarketDayProducts] = useState<MarketDayProduct[]>(() => {
    const stored = localStorage.getItem(`market_day_products_${marketDayId}`)
    return stored ? JSON.parse(stored) : []
  })

  const marketDay = marketDays.find(day => day.id === marketDayId)

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/auth" replace />
  }

  if (!marketDay) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-left">
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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    setMarketDayProducts(prev => {
      const existing = prev.find(p => p.productId === productId)
      const product = vendorProducts.find(p => p.id === productId)
      
      if (!product) return prev

      if (newQuantity === 0) {
        return prev.filter(p => p.productId !== productId)
      }

      if (existing) {
        return prev.map(p => 
          p.productId === productId 
            ? { ...p, quantity: newQuantity }
            : p
        )
      } else {
        return [...prev, {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productUnit: product.unit,
          productImage: product.image,
          quantity: newQuantity,
          packageSize: '1'
        }]
      }
    })
  }

  const handlePackageSizeChange = (productId: string, packageSize: string) => {
    setMarketDayProducts(prev => 
      prev.map(p => 
        p.productId === productId 
          ? { ...p, packageSize }
          : p
      )
    )
  }

  const getProductQuantity = (productId: string): number => {
    const product = marketDayProducts.find(p => p.productId === productId)
    return product?.quantity || 0
  }

  const getProductPackageSize = (productId: string): string => {
    const product = marketDayProducts.find(p => p.productId === productId)
    return product?.packageSize || '1'
  }

  const handleSave = () => {
    localStorage.setItem(`market_day_products_${marketDayId}`, JSON.stringify(marketDayProducts))
    toast.success('Products saved for this market day')
    navigate(`/vendor/market-day/${marketDayId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/vendor/market-day/${marketDayId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Market Day
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                Manage Products for {marketDay.scheduleName}
              </h1>
              <p className="text-gray-600 text-left">
                {marketDay.marketDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Products
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-left">Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {vendorProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any products yet.</p>
                <Button onClick={() => navigate('/vendor/add-products')}>
                  Add Products to Your Profile
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Package Size</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorProducts.map((product) => {
                      const quantity = getProductQuantity(product.id)
                      const packageSize = getProductPackageSize(product.id)
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium text-left">{product.name}</h3>
                                <p className="text-gray-600 text-left text-sm">per {product.unit}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">${product.price.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {product.organic && (
                                <Badge variant="secondary" className="text-xs">Organic</Badge>
                              )}
                              {product.local && (
                                <Badge variant="outline" className="text-xs">Local</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={packageSize}
                                onChange={(e) => handlePackageSizeChange(product.id, e.target.value)}
                                className="w-20 text-center"
                                placeholder="1"
                              />
                              <span className="text-sm text-gray-500">{product.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {marketDayProducts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-left">Products for This Market Day ({marketDayProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {marketDayProducts.map((product) => (
                  <div key={product.productId} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-left">{product.productName}</span>
                    <div className="text-right text-gray-600">
                      <span>{product.quantity} {product.productUnit}</span>
                      {product.packageSize !== '1' && (
                        <span className="ml-2 text-sm">(Package: {product.packageSize})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MarketDayProducts
