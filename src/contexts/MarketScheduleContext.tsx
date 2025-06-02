
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface MarketSchedule {
  id: string
  name: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  marketTime: string // HH:MM format
  openDaysBefore: number
  closeHoursAfter: number
  isActive: boolean
  createdAt: string
}

interface MarketScheduleContextType {
  schedules: MarketSchedule[]
  addSchedule: (schedule: Omit<MarketSchedule, 'id' | 'createdAt'>) => void
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
      setSchedules(JSON.parse(storedSchedules))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('marketplace_schedules', JSON.stringify(schedules))
  }, [schedules])

  const addSchedule = (scheduleData: Omit<MarketSchedule, 'id' | 'createdAt'>) => {
    const newSchedule: MarketSchedule = {
      ...scheduleData,
      id: Math.random().toString(36).substr(2, 9),
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

  const getNextMarketDate = (dayOfWeek: number): Date => {
    const now = new Date()
    const daysUntilMarket = (dayOfWeek - now.getDay() + 7) % 7 || 7
    const marketDate = new Date(now)
    marketDate.setDate(now.getDate() + daysUntilMarket)
    return marketDate
  }

  const getNextMarketInfo = () => {
    const activeSchedules = schedules.filter(s => s.isActive)
    if (activeSchedules.length === 0) return null

    const now = new Date()
    let nextMarket: Date | null = null
    let opensAt: Date | null = null
    let closesAt: Date | null = null

    activeSchedules.forEach(schedule => {
      const marketDate = getNextMarketDate(schedule.dayOfWeek)
      const [hours, minutes] = schedule.marketTime.split(':').map(Number)
      marketDate.setHours(hours, minutes, 0, 0)

      if (!nextMarket || marketDate < nextMarket) {
        nextMarket = marketDate
        
        // Calculate opening time (X days before market)
        opensAt = new Date(marketDate)
        opensAt.setDate(marketDate.getDate() - schedule.openDaysBefore)
        opensAt.setHours(0, 0, 0, 0)

        // Calculate closing time (Y hours after market)
        closesAt = new Date(marketDate)
        closesAt.setHours(marketDate.getHours() + schedule.closeHoursAfter)
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
