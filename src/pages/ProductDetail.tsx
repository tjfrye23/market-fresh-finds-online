import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, MapPin, Leaf, Award, Minus, Plus, Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { getMarketplaceProducts, getVendorByUserId } from '@/services/mockServices'
import { toast } from 'sonner'

interface MarketDayProduct {
  productId: string
  productName: string
  productPrice: number
  productUnit: string
  productImage?: string
  quantity: number
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { getUpcomingMarketDays } = useMarketSchedule()
  const [quantity, setQuantity] = useState(1)
  const [marketDayProduct, setMarketDayProduct] = useState<any>(null)
  const [selectedMarketDay, setSelectedMarketDay] = useState<string>('')

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getMarketplaceProducts,
  })

  const product = products.find(p => p.id === id)

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', product?.user_id],
    queryFn: () => product ? getVendorByUserId(product.user_id) : null,
    enabled: !!product?.user_id,
  })

  // Get selected market day from localStorage (set by the Shop page)
  useEffect(() => {
    const storedMarketDay = localStorage.getItem('selectedMarketDay')
    if (storedMarketDay) {
      setSelectedMarketDay(storedMarketDay)
    }
  }, [])

  // Load market day specific product data
  useEffect(() => {
    if (selectedMarketDay && id) {
      const storedProducts = localStorage.getItem(`market_day_products_${selectedMarketDay}`)
      if (storedProducts) {
        const marketDayProductsData: MarketDayProduct[] = JSON.parse(storedProducts)
        const foundProduct = marketDayProductsData.find(mdp => mdp.productId === id)
        
        if (foundProduct && product) {
          // Merge market day data with original product data
          setMarketDayProduct({
            ...product,
            price: foundProduct.productPrice,
            stock: foundProduct.quantity,
            image: foundProduct.productImage || product.image
          })
        } else {
          setMarketDayProduct(null)
        }
      } else {
        setMarketDayProduct(null)
      }
    }
  }, [selectedMarketDay, id, product])

  const marketDays = getUpcomingMarketDays()
  const selectedMarketDayData = marketDays.find(day => day.id === selectedMarketDay)

  // Use market day product if available, otherwise fall back to regular product
  const displayProduct = marketDayProduct || product
  const isMarketDaySpecific = !!marketDayProduct

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (displayProduct?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!displayProduct?.stock || displayProduct.stock === 0) {
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: displayProduct.id,
        name: displayProduct.name,
        price: displayProduct.price,
        unit: displayProduct.unit,
        image: displayProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
        farmName: vendor?.vendor_name,
      })
    }
  }

  const handleFavoriteToggle = () => {
    if (!displayProduct) return

    if (isFavorite(displayProduct.id)) {
      removeFromFavorites(displayProduct.id)
      toast.success(`${displayProduct.name} removed from favorites`)
    } else {
      addToFavorites({
        id: displayProduct.id,
        name: displayProduct.name,
        price: displayProduct.price,
        unit: displayProduct.unit,
        image: displayProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
        farmName: vendor?.vendor_name,
      })
      toast.success(`${displayProduct.name} added to favorites`)
    }
  }

  if (productsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="page-container py-8">
          <Link to="/shop" className="inline-flex items-center text-market-green hover:text-market-green-dark mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          {selectedMarketDayData && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-1">
                Viewing for {selectedMarketDayData.scheduleName}
              </h3>
              <p className="text-green-700 text-sm">
                {selectedMarketDayData.marketDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
              <img
                src={displayProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-10 w-10 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite(displayProduct.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                />
              </Button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                {displayProduct.organic && (
                  <Badge className="bg-market-green text-white">
                    <Leaf className="mr-1 h-3 w-3" />
                    Organic
                  </Badge>
                )}
                {displayProduct.local && (
                  <Badge className="bg-market-yellow text-market-brown-dark">
                    <MapPin className="mr-1 h-3 w-3" />
                    Local
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProduct.name}</h1>
              <p className="text-xl text-market-green-dark font-semibold mb-4">
                ${displayProduct.price.toFixed(2)} per {displayProduct.unit}
              </p>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {isMarketDaySpecific ? (
                    displayProduct.stock > 0 ? (
                      <span className="text-green-600">
                        {displayProduct.stock} {displayProduct.unit}(s) available for this market day
                      </span>
                    ) : (
                      <span className="text-red-600">Not available for this market day</span>
                    )
                  ) : (
                    <span className="text-amber-600">
                      No specific quantity set for selected market day
                    </span>
                  )}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                <Badge variant="outline" className="capitalize">
                  {displayProduct.category}
                </Badge>
              </div>

              {displayProduct.description && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{displayProduct.description}</p>
                </div>
              )}

              {vendor && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    From {vendor.vendor_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Owner: {vendor.owner_name}
                  </p>
                  {vendor.location && (
                    <p className="text-sm text-gray-600 mb-2">
                      Location: {vendor.location}
                    </p>
                  )}
                  {vendor.specialty && (
                    <p className="text-sm text-gray-600">
                      Specialty: {vendor.specialty}
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              {displayProduct.stock > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value)) {
                          handleQuantityChange(value)
                        }
                      }}
                      className="w-20 text-center"
                      min="1"
                      max={displayProduct.stock}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= displayProduct.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500 ml-2">
                      (Max: {displayProduct.stock})
                    </span>
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                className="bg-market-green hover:bg-market-green-dark text-white w-full sm:w-auto"
                onClick={handleAddToCart}
                disabled={!displayProduct.stock || displayProduct.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {displayProduct.stock > 0 ? `Add ${quantity} to Cart` : 'Not Available'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetail
