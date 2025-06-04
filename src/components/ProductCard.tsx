
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  id: string
  name: string
  price: number
  unit: string
  image: string
  organic?: boolean
  local?: boolean
  farmName?: string
}

const ProductCard = ({
  id,
  name,
  price,
  unit,
  image,
  organic = false,
  local = false,
  farmName,
}: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFavorite(id)) {
      removeFromFavorites(id)
    } else {
      addToFavorites({
        id,
        name,
        price,
        unit,
        image,
        farmName,
      })
    }
  }

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="product-image group-hover:scale-105 transition-transform duration-300"
        />

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {organic && (
            <span className="bg-market-green text-white text-xs px-2 py-1 rounded">
              Organic
            </span>
          )}
          {local && (
            <span className="bg-market-yellow text-market-brown-dark text-xs px-2 py-1 rounded">
              Local
            </span>
          )}
        </div>

        {/* Favorite button */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite(id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-market-green transition-colors">
            {name}
          </h3>
        </Link>
        {farmName && (
          <p className="text-gray-500 text-sm mb-2">from {farmName}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="font-bold text-market-green-dark">
              ${price.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm">per {unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
