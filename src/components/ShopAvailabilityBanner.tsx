
import React from 'react'
import { useMarketSchedule } from '@/contexts/MarketScheduleContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, AlertCircle, CheckCircle } from 'lucide-react'

const ShopAvailabilityBanner = () => {
  const { isShopOpen, getNextMarketInfo } = useMarketSchedule()
  const marketInfo = getNextMarketInfo()
  const shopOpen = isShopOpen()

  if (!marketInfo) return null

  const { nextMarket, opensAt, closesAt } = marketInfo
  const now = new Date()

  if (shopOpen) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Shop is open!</strong> Orders will be available for pickup at the next market on{' '}
          {nextMarket?.toLocaleDateString()}. Shop closes on{' '}
          {closesAt?.toLocaleString()}.
        </AlertDescription>
      </Alert>
    )
  }

  // Shop is closed
  if (opensAt && opensAt > now) {
    return (
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Shop is currently closed.</strong> Orders will open on{' '}
          {opensAt.toLocaleDateString()} for the market on{' '}
          {nextMarket?.toLocaleDateString()}.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Shop is closed.</strong> The ordering window for the next market has ended.
        Check back soon for the next market schedule.
      </AlertDescription>
    </Alert>
  )
}

export default ShopAvailabilityBanner
