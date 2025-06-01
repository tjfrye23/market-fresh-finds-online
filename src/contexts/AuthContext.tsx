
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { MockUser, mockUsers } from '@/data/mockData'

interface Session {
  user: MockUser
  access_token: string
}

type AuthContextType = {
  session: Session | null
  user: MockUser | null
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    data: { user: MockUser | null; session: Session | null } | null
  }>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string,
  ) => Promise<{
    error: Error | null
    data: { user: MockUser | null; session: Session | null } | null
  }>
  signOut: () => Promise<{ error: Error | null }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('mock_session')
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        setSession(parsedSession)
        setUser(parsedSession.user)
      } catch (error) {
        console.error('Error parsing saved session:', error)
        localStorage.removeItem('mock_session')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    // Simple mock authentication - just check if user exists
    const mockUser = mockUsers.find(u => u.email === email)
    
    if (!mockUser) {
      setLoading(false)
      return {
        error: new Error('Invalid email or password'),
        data: null
      }
    }

    const mockSession: Session = {
      user: mockUser,
      access_token: 'mock_token_' + Date.now()
    }

    localStorage.setItem('mock_session', JSON.stringify(mockSession))
    setSession(mockSession)
    setUser(mockUser)
    setLoading(false)

    return {
      error: null,
      data: { user: mockUser, session: mockSession }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'user' | 'vendor' | 'admin' = 'user',
  ) => {
    setLoading(true)

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      setLoading(false)
      return {
        error: new Error('User already exists with this email'),
        data: null
      }
    }

    // Create new mock user
    const newUser: MockUser = {
      id: 'user_' + Date.now(),
      email,
      fullName,
      role
    }

    // Add to mock users array (in real app this would be persistent)
    mockUsers.push(newUser)

    const mockSession: Session = {
      user: newUser,
      access_token: 'mock_token_' + Date.now()
    }

    localStorage.setItem('mock_session', JSON.stringify(mockSession))
    setSession(mockSession)
    setUser(newUser)
    setLoading(false)

    return {
      error: null,
      data: { user: newUser, session: mockSession }
    }
  }

  const signOut = async () => {
    setLoading(true)
    localStorage.removeItem('mock_session')
    setSession(null)
    setUser(null)
    navigate('/auth')
    setLoading(false)
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{ session, user, signIn, signUp, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
