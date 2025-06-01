
import { useQuery } from '@tanstack/react-query'
import { getVendorProducts } from '@/services/mockServices'
import { Product } from '@/components/product/types'
import { toast } from 'sonner'

export const useVendorProducts = (vendorId: string) => {
  return useQuery<Product[]>({
    queryKey: ['vendorProducts', vendorId],
    queryFn: async () => {
      try {
        const data = await getVendorProducts(vendorId)
        return data
      } catch (error) {
        toast.error('Failed to load products')
        return []
      }
    },
    enabled: Boolean(vendorId),
  })
}
