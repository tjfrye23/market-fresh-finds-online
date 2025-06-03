
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface MarketSchedule {
  id: string
  name: string
  marketDate: Date // Changed from dayOfWeek to marketDate
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  onlineStartTime: string // HH:MM format
  onlineEndTime: string // HH:MM format
  onlineStartDate: Date // New field for online shop start date
  onlineEndDate: Date // New field for online shop end date
  address: string // New address field
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

// Mock data for initial schedules
const mockSchedules: MarketSchedule[] = [
  {
    id: '1',
    name: 'Weekly Farmers Market',
    marketDate: new Date('2024-06-08'),
    startTime: '08:00',
    endTime: '14:00',
    onlineStartTime: '06:00',
    onlineEndTime: '16:00',
    onlineStartDate: new Date('2024-06-05'),
    onlineEndDate: new Date('2024-06-08'),
    address: '123 Main Street, Downtown Plaza',
    description: 'Our regular weekly farmers market featuring local vendors and fresh produce.',
    isActive: true,
    isRecurring: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Holiday Special Market',
    marketDate: new Date('2024-06-15'),
    startTime: '09:00',
    endTime: '15:00',
    onlineStartTime: '07:00',
    onlineEndTime: '17:00',
    onlineStartDate: new Date('2024-06-12'),
    onlineEndDate: new Date('2024-06-15'),
    address: '456 Park Avenue, City Center',
    description: 'Special holiday market with extended hours and additional vendors.',
    isActive: true,
    isRecurring: false,
    status: 'approved',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Summer Evening Market',
    marketDate: new Date('2024-06-22'),
    startTime: '16:00',
    endTime: '20:00',
    onlineStartTime: '14:00',
    onlineEndTime: '22:00',
    onlineStartDate: new Date('2024-06-20'),
    onlineEndDate: new Date('2024-06-22'),
    address: '789 Riverside Drive, Waterfront Park',
    description: 'Evening market for summer season with live music and food trucks.',
    isActive: false,
    isRecurring: true,
    status: 'pending review',
    createdAt: '2024-02-01T00:00:00Z'
  }
]

export const MarketScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<MarketSchedule[]>([])

  useEffect(() => {
    const storedSchedules = localStorage.getItem('marketplace_schedules')
    if (storedSchedules) {
      const parsed = JSON.parse(storedSchedules)
      // Convert date strings back to Date objects
      const schedulesWithDates = parsed.map((schedule: any) => ({
        ...schedule,
        marketDate: new Date(schedule.marketDate),
        onlineStartDate: new Date(schedule.onlineStartDate),
        onlineEndDate: new Date(schedule.onlineEndDate)
      }))
      setSchedules(schedulesWithDates)
    } else {
      // If no stored schedules, use mock data
      setSchedules(mockSchedules)
    }
  }, [])

  useEffect(() => {
    // Convert Date objects to strings for storage
    const schedulesForStorage = schedules.map(schedule => ({
      ...schedule,
      marketDate: schedule.marketDate.toISOString(),
      onlineStartDate: schedule.onlineStartDate.toISOString(),
      onlineEndDate: schedule.onlineEndDate.toISOString()
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
        
        // Calculate online opening time using the date range
        opensAt = new Date(schedule.onlineStartDate)
        const [onlineStartHours, onlineStartMinutes] = schedule.onlineStartTime.split(':').map(Number)
        opensAt.setHours(onlineStartHours, onlineStartMinutes, 0, 0)

        // Calculate online closing time using the date range
        closesAt = new Date(schedule.onlineEndDate)
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
