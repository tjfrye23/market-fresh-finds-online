import { Order, getOrders } from './orderService'

interface VendorMetrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

export const getVendorOrders = async (vendorId: string): Promise<Order[]> => {
  // In a real app, this would filter orders by vendor
  // For now, we'll return all orders as demo data since we don't have proper vendor linking
  const allOrders = getOrders()
  
  // Return all orders for demo purposes
  return allOrders
}

export const getVendorMetrics = async (vendorId: string): Promise<VendorMetrics> => {
  const vendorOrders = await getVendorOrders(vendorId)
  
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = vendorOrders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  // Generate monthly revenue data
  const monthlyData = new Map<string, number>()
  vendorOrders.forEach(order => {
    const date = new Date(order.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    if (!monthlyData.has(monthName)) {
      monthlyData.set(monthName, 0)
    }
    monthlyData.set(monthName, monthlyData.get(monthName)! + order.total)
  })
  
  const monthlyRevenue = Array.from(monthlyData.entries()).map(([month, revenue]) => ({
    month,
    revenue
  }))
  
  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    monthlyRevenue
  }
}
