
export interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'processing' | 'processed'
  total: number
  items: Array<{
    id?: string
    name: string
    quantity: number
    price: number
    farmName?: string
    vendorId?: string
  }>
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export const saveOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Order => {
  const orders = getOrders()
  
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    status: 'processing'
  }
  
  const updatedOrders = [...orders, newOrder]
  localStorage.setItem('marketplace_orders', JSON.stringify(updatedOrders))
  
  return newOrder
}

export const getOrders = (): Order[] => {
  const storedOrders = localStorage.getItem('marketplace_orders')
  return storedOrders ? JSON.parse(storedOrders) : []
}

export const getUserOrders = (userEmail: string): Order[] => {
  const orders = getOrders()
  return orders.filter(order => order.customerInfo.email === userEmail)
}
