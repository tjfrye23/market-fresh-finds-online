import { supabase } from '../client'
import { VendorProfile } from '../types'

export const getVendorData = async (id: string): Promise<VendorProfile> => {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  else return data
}
