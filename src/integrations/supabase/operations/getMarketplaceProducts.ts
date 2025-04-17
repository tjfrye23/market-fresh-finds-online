import { supabase } from '../client'
import { VendorProducts } from '../types'

export const getMarketplaceProducts = async (): Promise<VendorProducts[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  else return data
}
