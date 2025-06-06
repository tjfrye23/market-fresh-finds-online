import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Calendar, MapPin, Clock } from 'lucide-react'
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
      return `Online ordering opens ${onlineStart.toLocaleDateString()} at ${marketDay.onlineStartTime}`
    } else if (now > onlineEnd) {
      return 'Online ordering has closed for this market day'
    }
    return null
  }

  const availableMarketDays = marketDays.filter(isMarketDayAvailable)

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
      ) : availableMarketDays.length === 0 ? (
        <div className="text-center py-4">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 mb-2">No market days available for online ordering right now.</p>
          <div className="space-y-2 text-sm text-gray-400">
            {marketDays.map((marketDay) => (
              <div key={marketDay.id} className="p-2 bg-gray-50 rounded">
                <p className="font-medium">{formatMarketDay(marketDay)}</p>
                <p>{getAvailabilityMessage(marketDay)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Select value={selectedMarketDay} onValueChange={onSelectMarketDay}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a market day to shop for..." />
            </SelectTrigger>
            <SelectContent>
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
            </SelectContent>
          </Select>
          
          {/* Show unavailable market days as accordion */}
          {marketDays.length > availableMarketDays.length && (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="upcoming-markets" className="border border-gray-200 rounded-md">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700">
                      Upcoming Market Days
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2 text-sm">
                    {marketDays
                      .filter(day => !isMarketDayAvailable(day))
                      .map((marketDay) => (
                        <div key={marketDay.id} className="text-gray-500">
                          <p className="font-medium">{formatMarketDay(marketDay)}</p>
                          <p className="text-xs">{getAvailabilityMessage(marketDay)}</p>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketDaySelector
