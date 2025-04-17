import { supabase } from '../client'
import { VendorProducts } from '../types'

export const getVendorProducts = async (
  vendorId: string,
): Promise<VendorProducts[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  else return data
}
