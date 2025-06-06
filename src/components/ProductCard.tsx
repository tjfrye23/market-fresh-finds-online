
import React, { useState } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)
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
    <div 
      className="bg-white rounded-lg shadow-md p-4 w-64 font-sans transition-all duration-200 hover:shadow-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="mb-4 relative">
        <img 
          src={image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'}
          alt={name}
          className="w-full h-48 object-contain mx-auto"
        />

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

      {/* Organic/Local Badge */}
      {(organic || local) && (
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span className="text-sm text-gray-600">
            {[organic && 'Organic', local && 'Local'].filter(Boolean).join(', ')}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline mb-3">
        <span className="text-2xl font-bold text-gray-800">${Math.floor(price)}</span>
        <span className="text-lg text-gray-800 ml-1">{String(price % 1).slice(1) || '00'}</span>
        <span className="text-gray-500 ml-2">/{unit}</span>
      </div>

      {/* Product Title */}
      <Link to={`/product/${id}`}>
        <h3 className="text-gray-800 font-medium text-base mb-3 leading-tight hover:text-market-green transition-colors">
          {name}
        </h3>
      </Link>

      {/* Farm Name */}
      {farmName && (
        <p className="text-gray-500 text-sm mb-2">from {farmName}</p>
      )}
    </div>
  )
}

export default ProductCard
