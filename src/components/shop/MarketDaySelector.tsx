
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, MapPin } from 'lucide-react'
import { MarketDay } from '@/contexts/MarketScheduleContext'

interface MarketDaySelectorProps {
  marketDays: MarketDay[]
  selectedMarketDay: string
  onSelectMarketDay: (marketDayId: string) => void
}

const MarketDaySelector = ({
  marketDays,
  selectedMarketDay,
  onSelectMarketDay,
}: MarketDaySelectorProps) => {
  const formatMarketDay = (marketDay: MarketDay) => {
    const date = marketDay.marketDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return `${date} - ${marketDay.scheduleName}`
  }

  const getMarketDayDetails = (marketDay: MarketDay) => {
    const time = `${marketDay.startTime} - ${marketDay.endTime}`
    return `${time} • ${marketDay.address}`
  }

  const isMarketDayAvailable = (marketDay: MarketDay) => {
    const now = new Date()
    const onlineStart = new Date(marketDay.onlineStartDate)
    const onlineEnd = new Date(marketDay.onlineEndDate)
    
    // Set the time for online start
    const [startHours, startMinutes] = marketDay.onlineStartTime.split(':').map(Number)
    onlineStart.setHours(startHours, startMinutes, 0, 0)
    
    // Set the time for online end
    const [endHours, endMinutes] = marketDay.onlineEndTime.split(':').map(Number)
    onlineEnd.setHours(endHours, endMinutes, 0, 0)
    
    return now >= onlineStart && now <= onlineEnd
  }

  const getAvailabilityMessage = (marketDay: MarketDay) => {
    const now = new Date()
    const onlineStart = new Date(marketDay.onlineStartDate)
    const onlineEnd = new Date(marketDay.onlineEndDate)
    
    const [startHours, startMinutes] = marketDay.onlineStartTime.split(':').map(Number)
    onlineStart.setHours(startHours, startMinutes, 0, 0)
    
    const [endHours, endMinutes] = marketDay.onlineEndTime.split(':').map(Number)
    onlineEnd.setHours(endHours, endMinutes, 0, 0)
    
    if (now < onlineStart) {
      return `Opens ${onlineStart.toLocaleDateString()} at ${marketDay.onlineStartTime}`
    } else if (now > onlineEnd) {
      return 'Ordering closed'
    }
    return null
  }

  const availableMarketDays = marketDays.filter(isMarketDayAvailable)
  const unavailableMarketDays = marketDays.filter(day => !isMarketDayAvailable(day))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {marketDays.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No upcoming market days scheduled.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold whitespace-nowrap">Select Market Day</h2>
          </div>
          <div className="flex-1">
            <Select value={selectedMarketDay} onValueChange={onSelectMarketDay}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a market day to shop for..." />
              </SelectTrigger>
              <SelectContent>
                {/* Available market days */}
                {availableMarketDays.map((marketDay) => (
                  <SelectItem key={marketDay.id} value={marketDay.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatMarketDay(marketDay)}</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {getMarketDayDetails(marketDay)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                
                {/* Unavailable market days as disabled options */}
                {unavailableMarketDays.map((marketDay) => (
                  <SelectItem 
                    key={`unavailable-${marketDay.id}`} 
                    value={`unavailable-${marketDay.id}`}
                    disabled
                    className="opacity-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-400">{formatMarketDay(marketDay)}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {getAvailabilityMessage(marketDay)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketDaySelector
