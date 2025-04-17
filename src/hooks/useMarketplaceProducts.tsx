import { Product } from '@/components/product/types'
import { supabase } from '@/integrations/supabase/client'
import { getMarketplaceProducts } from '@/integrations/supabase/operations/getMarketplaceProducts'
import { VendorProducts } from '@/integrations/supabase/types'
import { useQuery } from '@tanstack/react-query'

export const useMarketplaceProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      let data: VendorProducts[]
      try {
        data = await getMarketplaceProducts()
      } catch (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return data
    },
  })
}
