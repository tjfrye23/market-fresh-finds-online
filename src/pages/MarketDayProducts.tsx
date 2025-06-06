
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Save,
  MoreHorizontal
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
  prepackaged: boolean
  packageId?: string // unique ID for each package size row
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

  const generatePackageId = () => `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const handleQuantityChange = (packageId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    setMarketDayProducts(prev => {
      if (newQuantity === 0) {
        return prev.filter(p => p.packageId !== packageId)
      }

      const existing = prev.find(p => p.packageId === packageId)
      if (existing) {
        return prev.map(p => 
          p.packageId === packageId 
            ? { ...p, quantity: newQuantity }
            : p
        )
      }

      return prev
    })
  }

  const handlePackageSizeChange = (packageId: string, packageSize: string) => {
    setMarketDayProducts(prev => 
      prev.map(p => 
        p.packageId === packageId 
          ? { ...p, packageSize }
          : p
      )
    )
  }

  const handlePrepackagedChange = (packageId: string, prepackaged: boolean) => {
    setMarketDayProducts(prev => 
      prev.map(p => 
        p.packageId === packageId 
          ? { ...p, prepackaged, packageSize: prepackaged ? p.packageSize : '' }
          : p
      )
    )
  }

  const addNewPackageSize = (productId: string) => {
    const product = vendorProducts.find(p => p.id === productId)
    if (!product) return

    const newPackage: MarketDayProduct = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productUnit: product.unit,
      productImage: product.image,
      quantity: 0,
      packageSize: '',
      prepackaged: false,
      packageId: generatePackageId()
    }

    setMarketDayProducts(prev => [...prev, newPackage])
  }

  const getProductPackages = (productId: string): MarketDayProduct[] => {
    return marketDayProducts.filter(p => p.productId === productId)
  }

  const handleSave = () => {
    localStorage.setItem(`market_day_products_${marketDayId}`, JSON.stringify(marketDayProducts))
    toast.success('Products saved for this market day')
    navigate(`/vendor/market-day/${marketDayId}`)
  }

  // Group products for display
  const getProductRows = () => {
    const rows: Array<{ product: any; package?: MarketDayProduct; isMainRow: boolean }> = []
    
    vendorProducts.forEach(product => {
      const packages = getProductPackages(product.id)
      
      if (packages.length === 0) {
        // Show product with empty package row
        rows.push({ product, isMainRow: true })
      } else {
        // Show product with first package
        rows.push({ product, package: packages[0], isMainRow: true })
        
        // Show additional packages
        packages.slice(1).forEach(pkg => {
          rows.push({ product, package: pkg, isMainRow: false })
        })
      }
    })
    
    return rows
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
                      <TableHead>Prepackaged</TableHead>
                      <TableHead>Package Size</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getProductRows().map((row, index) => {
                      const { product, package: pkg, isMainRow } = row
                      const packageId = pkg?.packageId || `temp-${product.id}`
                      
                      return (
                        <TableRow key={`${product.id}-${index}`}>
                          <TableCell>
                            {isMainRow ? (
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
                            ) : (
                              <div className="pl-15">
                                <span className="text-gray-400 text-sm">Additional package</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {isMainRow && (
                              <span className="font-medium">${product.price.toFixed(2)} per {product.unit}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isMainRow && (
                              <div className="flex gap-1 flex-wrap">
                                {product.organic && (
                                  <Badge variant="secondary" className="text-xs">Organic</Badge>
                                )}
                                {product.local && (
                                  <Badge variant="outline" className="text-xs">Local</Badge>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={pkg?.prepackaged || false}
                              onCheckedChange={(checked) => {
                                if (pkg) {
                                  handlePrepackagedChange(packageId, !!checked)
                                } else {
                                  addNewPackageSize(product.id)
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={pkg?.packageSize || ''}
                                onChange={(e) => {
                                  if (pkg) {
                                    handlePackageSizeChange(packageId, e.target.value)
                                  } else {
                                    addNewPackageSize(product.id)
                                  }
                                }}
                                className="w-20 text-center"
                                placeholder=""
                                disabled={!pkg?.prepackaged}
                              />
                              <span className="text-sm text-gray-500">{product.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pkg?.quantity || 0}
                              onChange={(e) => {
                                if (pkg) {
                                  handleQuantityChange(packageId, parseInt(e.target.value) || 0)
                                } else {
                                  addNewPackageSize(product.id)
                                }
                              }}
                              className="w-20 text-center"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => addNewPackageSize(product.id)}>
                                  Add new package size
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                  <div key={product.packageId} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-left">{product.productName}</span>
                    <div className="text-right text-gray-600">
                      <span>{product.quantity} {product.productUnit}</span>
                      {product.prepackaged && product.packageSize && (
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
