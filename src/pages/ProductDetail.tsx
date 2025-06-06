import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, MapPin, Leaf, Award, Minus, Plus, Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  packageSize: string
  prepackaged: boolean
  packageId?: string
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { getUpcomingMarketDays } = useMarketSchedule()
  const [quantity, setQuantity] = useState(1)
  const [availablePackages, setAvailablePackages] = useState<MarketDayProduct[]>([])
  const [selectedPackage, setSelectedPackage] = useState<MarketDayProduct | null>(null)
  const [selectedMarketDay, setSelectedMarketDay] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)

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

  // Load market day specific product packages
  useEffect(() => {
    if (selectedMarketDay && id) {
      const storedProducts = localStorage.getItem(`market_day_products_${selectedMarketDay}`)
      if (storedProducts) {
        const marketDayProductsData: MarketDayProduct[] = JSON.parse(storedProducts)
        const productPackages = marketDayProductsData.filter(mdp => mdp.productId === id)
        
        setAvailablePackages(productPackages)
        
        // Select the first available package by default
        if (productPackages.length > 0) {
          setSelectedPackage(productPackages[0])
        } else {
          setSelectedPackage(null)
        }
      } else {
        setAvailablePackages([])
        setSelectedPackage(null)
      }
    }
  }, [selectedMarketDay, id])

  const marketDays = getUpcomingMarketDays()
  const selectedMarketDayData = marketDays.find(day => day.id === selectedMarketDay)

  // Use selected package data if available, otherwise fall back to regular product
  const displayProduct = selectedPackage ? {
    ...product,
    price: selectedPackage.productPrice,
    stock: selectedPackage.quantity,
    image: selectedPackage.productImage || product?.image
  } : product

  const isMarketDaySpecific = !!selectedPackage

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (displayProduct?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handlePackageChange = (packageId: string) => {
    const pkg = availablePackages.find(p => p.packageId === packageId)
    if (pkg) {
      setSelectedPackage(pkg)
      setQuantity(1) // Reset quantity when changing package
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

  // Create product images array for gallery
  const productImages = [
    displayProduct?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
    // Add placeholder variations for gallery
    displayProduct?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
    displayProduct?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'
  ]

  const quantityOptions = Array.from({ length: Math.min(10, displayProduct?.stock || 10) }, (_, i) => i + 1)

  const truncatedDescription = displayProduct?.description 
    ? displayProduct.description.split('. ').slice(0, 2).join('. ') + '.'
    : ''

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
          <div className="text-left">
            <Link to="/shop" className="inline-flex items-center text-market-green hover:text-market-green-dark mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img 
                    src={productImages[selectedImage]} 
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
                
                {/* Thumbnail Gallery */}
                <div className="flex space-x-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-green-600 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Category */}
                <div className="text-left">
                  <button className="text-sm font-medium text-gray-600 uppercase tracking-wide hover:text-gray-800 transition-colors duration-200 text-left">
                    {displayProduct.category}
                  </button>
                </div>

                {/* Product Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight text-left">
                  {displayProduct.name}
                </h1>

                {/* Product Tags */}
                <div className="flex space-x-2 justify-start">
                  {displayProduct.organic && (
                    <Badge className="bg-market-green text-white">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Organic
                    </Badge>
                  )}
                  {displayProduct.local && (
                    <Badge className="bg-orange-400 text-white">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Local
                    </Badge>
                  )}
                </div>

                {/* Vendor Name */}
                {vendor && (
                  <Link 
                    to={`/vendors/${vendor.id}`}
                    className="text-lg font-medium text-green-600 hover:text-green-700 transition-colors duration-200 text-left block"
                  >
                    {vendor.vendor_name}
                  </Link>
                )}

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900 text-left">
                  ${displayProduct.price.toFixed(2)}/{displayProduct.unit}
                </div>

                {/* Store Information */}
                {selectedMarketDayData && (
                  <div className="space-y-2 text-left">
                    <div className="text-gray-700">
                      Pickup at <span className="font-bold text-gray-900">Charlotte Regional Farmer's Market</span> on{' '}
                      <span className="font-bold text-gray-900">
                        {selectedMarketDayData.marketDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </span> between{' '}
                      <span className="font-bold text-gray-900">9AM-4PM</span>
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-4 text-left">
                  <p className="text-sm text-gray-600">
                    {displayProduct.stock > 0 ? (
                      <span className="text-green-600">
                        {displayProduct.stock} {displayProduct.unit}(s) available
                      </span>
                    ) : (
                      <span className="text-red-600">Not available</span>
                    )}
                  </p>
                </div>

                {/* Pricing and Add to Cart Section */}
                {displayProduct.stock > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Package Options Selector */}
                    {availablePackages.length > 0 && (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700 text-left">Package Options</label>
                        <div className="relative">
                          <select 
                            value={selectedPackage?.packageId || ''}
                            onChange={(e) => handlePackageChange(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-left text-sm font-medium appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {availablePackages.map((pkg) => (
                              <option key={pkg.packageId} value={pkg.packageId || ''}>
                                {pkg.prepackaged && pkg.packageSize 
                                  ? `${pkg.packageSize} ${pkg.productUnit} package`
                                  : `Bulk ${pkg.productUnit}`
                                } - ${(pkg.productPrice * quantity).toFixed(2)}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700 text-left">Quantity</label>
                      <div className="relative">
                        <select 
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-left text-sm font-medium appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {quantityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Total Price Display */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total:</span>
                        <span className="text-xl font-bold text-gray-900">
                          ${(displayProduct.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-base"
                    >
                      <ShoppingCart className="inline mr-2 h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                )}

                {/* Product Description */}
                {displayProduct.description && (
                  <div className="space-y-3 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 text-left">Description</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed text-left">
                        {showFullDescription ? displayProduct.description : truncatedDescription}
                      </p>
                      {displayProduct.description.length > truncatedDescription.length && (
                        <button 
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm underline text-left"
                        >
                          {showFullDescription ? 'Show less' : 'More'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetail
