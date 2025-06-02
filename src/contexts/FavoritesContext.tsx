
import React, { createContext, useContext, useState, useEffect } from 'react'

interface FavoriteProduct {
  id: string
  name: string
  price: number
  unit: string
  image: string
  farmName?: string
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addToFavorites: (product: FavoriteProduct) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  getFavoritesCount: () => number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('marketplace_favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('marketplace_favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product: FavoriteProduct) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId)
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
