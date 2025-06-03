
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface MarketSchedule {
  id: string
  name: string
  marketDate: Date // Changed from dayOfWeek to marketDate
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  onlineStartTime: string // HH:MM format
  onlineEndTime: string // HH:MM format
  description: string
  isActive: boolean
  isRecurring: boolean
  status: 'pending review' | 'approved' | 'rejected'
  createdAt: string
}

interface MarketScheduleContextType {
  schedules: MarketSchedule[]
  addSchedule: (schedule: Omit<MarketSchedule, 'id' | 'createdAt' | 'status'>) => void
  updateSchedule: (id: string, updates: Partial<MarketSchedule>) => void
  deleteSchedule: (id: string) => void
  isShopOpen: () => boolean
  getNextMarketInfo: () => { nextMarket: Date | null; opensAt: Date | null; closesAt: Date | null } | null
}

const MarketScheduleContext = createContext<MarketScheduleContextType | undefined>(undefined)

export const MarketScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<MarketSchedule[]>([])

  useEffect(() => {
    const storedSchedules = localStorage.getItem('marketplace_schedules')
    if (storedSchedules) {
      const parsed = JSON.parse(storedSchedules)
      // Convert marketDate strings back to Date objects
      const schedulesWithDates = parsed.map((schedule: any) => ({
        ...schedule,
        marketDate: new Date(schedule.marketDate)
      }))
      setSchedules(schedulesWithDates)
    }
  }, [])

  useEffect(() => {
    // Convert Date objects to strings for storage
    const schedulesForStorage = schedules.map(schedule => ({
      ...schedule,
      marketDate: schedule.marketDate.toISOString()
    }))
    localStorage.setItem('marketplace_schedules', JSON.stringify(schedulesForStorage))
  }, [schedules])

  const addSchedule = (scheduleData: Omit<MarketSchedule, 'id' | 'createdAt' | 'status'>) => {
    const newSchedule: MarketSchedule = {
      ...scheduleData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending review',
      createdAt: new Date().toISOString()
    }
    setSchedules(prev => [...prev, newSchedule])
  }

  const updateSchedule = (id: string, updates: Partial<MarketSchedule>) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, ...updates } : schedule
    ))
  }

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id))
  }

  const getNextMarketInfo = () => {
    const activeSchedules = schedules.filter(s => s.isActive)
    if (activeSchedules.length === 0) return null

    const now = new Date()
    let nextMarket: Date | null = null
    let opensAt: Date | null = null
    let closesAt: Date | null = null

    activeSchedules.forEach(schedule => {
      let marketDate = new Date(schedule.marketDate)
      
      // If the market date has passed and it's recurring, find the next occurrence
      if (schedule.isRecurring && marketDate < now) {
        const dayOfWeek = marketDate.getDay()
        const currentDay = now.getDay()
        const daysUntilNext = (dayOfWeek - currentDay + 7) % 7 || 7
        marketDate = new Date(now)
        marketDate.setDate(now.getDate() + daysUntilNext)
      }

      // Set the market start time
      const [startHours, startMinutes] = schedule.startTime.split(':').map(Number)
      marketDate.setHours(startHours, startMinutes, 0, 0)

      if (!nextMarket || marketDate < nextMarket) {
        nextMarket = marketDate
        
        // Calculate online opening time
        opensAt = new Date(marketDate)
        const [onlineStartHours, onlineStartMinutes] = schedule.onlineStartTime.split(':').map(Number)
        opensAt.setHours(onlineStartHours, onlineStartMinutes, 0, 0)

        // Calculate online closing time
        closesAt = new Date(marketDate)
        const [onlineEndHours, onlineEndMinutes] = schedule.onlineEndTime.split(':').map(Number)
        closesAt.setHours(onlineEndHours, onlineEndMinutes, 0, 0)
      }
    })

    return { nextMarket, opensAt, closesAt }
  }

  const isShopOpen = (): boolean => {
    const marketInfo = getNextMarketInfo()
    if (!marketInfo || !marketInfo.opensAt || !marketInfo.closesAt) return true // Default to open if no schedule

    const now = new Date()
    return now >= marketInfo.opensAt && now <= marketInfo.closesAt
  }

  return (
    <MarketScheduleContext.Provider value={{
      schedules,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      isShopOpen,
      getNextMarketInfo
    }}>
      {children}
    </MarketScheduleContext.Provider>
  )
}

export const useMarketSchedule = () => {
  const context = useContext(MarketScheduleContext)
  if (context === undefined) {
    throw new Error('useMarketSchedule must be used within a MarketScheduleProvider')
  }
  return context
}
