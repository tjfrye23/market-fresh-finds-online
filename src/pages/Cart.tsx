
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { useQuery } from '@tanstack/react-query'
import { getMarketplaceProducts } from '@/services/mockServices'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { useState, useEffect } from 'react'

interface MarketDayProduct {
  productId: string
  productName: string
  productPrice: number
  productUnit: string
  productImage?: string
  quantity: number
}

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const { getUpcomingMarketDays } = useMarketSchedule()
  const [selectedMarketDay, setSelectedMarketDay] = useState<string>('')
  const [marketDayProducts, setMarketDayProducts] = useState<MarketDayProduct[]>([])
  
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getMarketplaceProducts,
  })

  // Get selected market day from localStorage
  useEffect(() => {
    const storedMarketDay = localStorage.getItem('selectedMarketDay')
    if (storedMarketDay) {
      setSelectedMarketDay(storedMarketDay)
    }
  }, [])

  // Load market day products
  useEffect(() => {
    if (selectedMarketDay) {
      const storedProducts = localStorage.getItem(`market_day_products_${selectedMarketDay}`)
      if (storedProducts) {
        const marketDayProductsData: MarketDayProduct[] = JSON.parse(storedProducts)
        setMarketDayProducts(marketDayProductsData)
      }
    }
  }, [selectedMarketDay])

  const marketDays = getUpcomingMarketDays()
  const selectedMarketDayData = marketDays.find(day => day.id === selectedMarketDay)

  // Get market day specific data for a cart item
  const getMarketDayItemData = (item: any) => {
    const marketDayProduct = marketDayProducts.find(mdp => mdp.productId === item.id)
    if (marketDayProduct) {
      return {
        price: marketDayProduct.productPrice,
        maxQuantity: marketDayProduct.quantity,
        image: marketDayProduct.productImage || item.image
      }
    }
    
    // Fallback to original product data
    const originalProduct = products.find(p => p.id === item.id)
    return {
      price: item.price,
      maxQuantity: originalProduct?.stock || 0,
      image: item.image
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {selectedMarketDayData && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-1">
              Items for {selectedMarketDayData.scheduleName}
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
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const marketDayData = getMarketDayItemData(item)
              
              return (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                  <img
                    src={marketDayData.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    {item.farmName && (
                      <p className="text-gray-500 text-sm">from {item.farmName}</p>
                    )}
                    <p className="text-market-green-dark font-bold">
                      ${marketDayData.price.toFixed(2)} per {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {marketDayData.maxQuantity} available for this market day
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= marketDayData.maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${(marketDayData.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Cart
