import { Product } from '@/components/product/types'
import { getVendorProducts } from '@/integrations/supabase/operations/getVendorProducts'
import { VendorProducts } from '@/integrations/supabase/types'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVendorProducts = (vendorId: string) => {
  return useQuery<Product[]>({
    queryKey: ['vendorProducts', vendorId],
    queryFn: async () => {
      let data: VendorProducts[]
      try {
        const data = await getVendorProducts(vendorId)
      } catch (error) {
        toast.error('Failed to load products')
      }

      return data || []
    },
    enabled: Boolean(vendorId),
  })
}
