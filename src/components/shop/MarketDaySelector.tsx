
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Select Market Day</h2>
      </div>
      
      {marketDays.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No upcoming market days scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Select value={selectedMarketDay} onValueChange={onSelectMarketDay}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a market day to shop for..." />
            </SelectTrigger>
            <SelectContent>
              {marketDays.map((marketDay) => (
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
            </SelectContent>
          </Select>
          
          {selectedMarketDay && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              {(() => {
                const selected = marketDays.find(day => day.id === selectedMarketDay)
                if (!selected) return null
                
                return (
                  <div>
                    <p className="text-green-800 font-medium">
                      Shopping for: {formatMarketDay(selected)}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      {getMarketDayDetails(selected)}
                    </p>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketDaySelector
