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

export interface MarketDay {
  id: string
  scheduleId: string
  scheduleName: string
  marketDate: Date
  startTime: string
  endTime: string
  onlineStartTime: string
  onlineEndTime: string
  onlineStartDate: Date
  onlineEndDate: Date
  address: string
  description: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  createdAt: string
}

interface MarketScheduleContextType {
  schedules: MarketSchedule[]
  marketDays: MarketDay[]
  addSchedule: (schedule: Omit<MarketSchedule, 'id' | 'createdAt' | 'status'>) => void
  updateSchedule: (id: string, updates: Partial<MarketSchedule>) => void
  deleteSchedule: (id: string) => void
  getUpcomingMarketDays: () => MarketDay[]
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

const generateMarketDays = (schedule: MarketSchedule): MarketDay[] => {
  const marketDays: MarketDay[] = []
  const today = new Date()
  
  if (!schedule.isRecurring) {
    // Create single market day
    marketDays.push({
      id: `${schedule.id}-${schedule.marketDate.getTime()}`,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      marketDate: new Date(schedule.marketDate),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      onlineStartTime: schedule.onlineStartTime,
      onlineEndTime: schedule.onlineEndTime,
      onlineStartDate: new Date(schedule.onlineStartDate),
      onlineEndDate: new Date(schedule.onlineEndDate),
      address: schedule.address,
      description: schedule.description,
      status: schedule.marketDate < today ? 'completed' : 'scheduled',
      createdAt: new Date().toISOString()
    })
  } else {
    // Create market days for 4 weeks out
    const dayOfWeek = schedule.marketDate.getDay()
    const startDate = new Date(today)
    
    // Find the next occurrence of this day of the week
    const daysUntilNext = (dayOfWeek - startDate.getDay() + 7) % 7
    if (daysUntilNext === 0 && startDate.getTime() < schedule.marketDate.getTime()) {
      startDate.setDate(startDate.getDate() + 7)
    } else {
      startDate.setDate(startDate.getDate() + daysUntilNext)
    }
    
    // Generate 4 weeks of market days
    for (let week = 0; week < 4; week++) {
      const marketDate = new Date(startDate)
      marketDate.setDate(startDate.getDate() + (week * 7))
      
      // Calculate online dates based on the original offset
      const originalOffset = schedule.onlineStartDate.getTime() - schedule.marketDate.getTime()
      const onlineStartDate = new Date(marketDate.getTime() + originalOffset)
      
      const originalEndOffset = schedule.onlineEndDate.getTime() - schedule.marketDate.getTime()
      const onlineEndDate = new Date(marketDate.getTime() + originalEndOffset)
      
      marketDays.push({
        id: `${schedule.id}-${marketDate.getTime()}`,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        marketDate: marketDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        onlineStartTime: schedule.onlineStartTime,
        onlineEndTime: schedule.onlineEndTime,
        onlineStartDate: onlineStartDate,
        onlineEndDate: onlineEndDate,
        address: schedule.address,
        description: schedule.description,
        status: marketDate < today ? 'completed' : 'scheduled',
        createdAt: new Date().toISOString()
      })
    }
  }
  
  return marketDays
}

export const MarketScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<MarketSchedule[]>([])
  const [marketDays, setMarketDays] = useState<MarketDay[]>([])

  useEffect(() => {
    const storedSchedules = localStorage.getItem('marketplace_schedules')
    const storedMarketDays = localStorage.getItem('marketplace_market_days')
    
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
    
    if (storedMarketDays) {
      const parsed = JSON.parse(storedMarketDays)
      const marketDaysWithDates = parsed.map((day: any) => ({
        ...day,
        marketDate: new Date(day.marketDate),
        onlineStartDate: new Date(day.onlineStartDate),
        onlineEndDate: new Date(day.onlineEndDate)
      }))
      setMarketDays(marketDaysWithDates)
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

  useEffect(() => {
    // Convert Date objects to strings for storage
    const marketDaysForStorage = marketDays.map(day => ({
      ...day,
      marketDate: day.marketDate.toISOString(),
      onlineStartDate: day.onlineStartDate.toISOString(),
      onlineEndDate: day.onlineEndDate.toISOString()
    }))
    localStorage.setItem('marketplace_market_days', JSON.stringify(marketDaysForStorage))
  }, [marketDays])

  const addSchedule = (scheduleData: Omit<MarketSchedule, 'id' | 'createdAt' | 'status'>) => {
    const newSchedule: MarketSchedule = {
      ...scheduleData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending review',
      createdAt: new Date().toISOString()
    }
    setSchedules(prev => [...prev, newSchedule])
    
    // Don't generate market days immediately - wait for approval
  }

  const updateSchedule = (id: string, updates: Partial<MarketSchedule>) => {
    const oldSchedule = schedules.find(s => s.id === id)
    const newSchedule = { ...oldSchedule, ...updates } as MarketSchedule
    
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? newSchedule : schedule
    ))
    
    // If schedule status is being changed to 'approved', generate market days
    if (oldSchedule?.status !== 'approved' && updates.status === 'approved') {
      const newMarketDays = generateMarketDays(newSchedule)
      setMarketDays(prev => [...prev, ...newMarketDays])
    }
    // If schedule was approved and is being changed to something else, remove market days
    else if (oldSchedule?.status === 'approved' && updates.status && updates.status !== 'approved') {
      setMarketDays(prev => prev.filter(day => day.scheduleId !== id))
    }
    // If schedule is already approved and other fields are updated, regenerate market days
    else if (oldSchedule?.status === 'approved' && newSchedule.status === 'approved') {
      // Remove old market days for this schedule
      setMarketDays(prev => prev.filter(day => day.scheduleId !== id))
      // Generate new market days
      const newMarketDays = generateMarketDays(newSchedule)
      setMarketDays(prev => [...prev, ...newMarketDays])
    }
  }

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id))
    // Remove associated market days
    setMarketDays(prev => prev.filter(day => day.scheduleId !== id))
  }

  const getUpcomingMarketDays = () => {
    const fourWeeksFromNow = new Date()
    fourWeeksFromNow.setDate(fourWeeksFromNow.getDate() + 28)
    
    return marketDays
      .filter(day => day.marketDate <= fourWeeksFromNow)
      .sort((a, b) => a.marketDate.getTime() - b.marketDate.getTime())
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
      marketDays,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      getUpcomingMarketDays,
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
