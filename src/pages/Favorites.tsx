
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      farmName: product.farmName,
    })
    toast.success(`${product.name} added to cart`)
  }

  const handleRemoveFromFavorites = (productId: string, productName: string) => {
    removeFromFavorites(productId)
    toast.success(`${productName} removed from favorites`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="page-container py-8">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding products to your favorites by clicking the heart icon on any product.
              </p>
              <Link to="/shop">
                <Button className="bg-market-green hover:bg-market-green-dark text-white">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                      onClick={() => handleRemoveFromFavorites(product.id, product.name)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/shop/${product.id}`}>
                      <h3 className="font-medium text-lg mb-1 hover:text-market-green transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.farmName && (
                      <p className="text-gray-500 text-sm mb-2">from {product.farmName}</p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-market-green-dark">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-gray-500 text-sm">per {product.unit}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-market-green hover:bg-market-green-dark text-white"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Favorites
