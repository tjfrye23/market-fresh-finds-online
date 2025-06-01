
import { useQuery } from '@tanstack/react-query'
import { getMarketplaceProducts } from '@/services/mockServices'
import { Product } from '@/components/product/types'

export const useMarketplaceProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await getMarketplaceProducts()
        return data
      } catch (error) {
        console.error('Error fetching products:', error)
        return []
      }
    },
  })
}
