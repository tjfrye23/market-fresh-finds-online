import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userRole, setUserRole] = useState('user')
  const [rememberMe, setRememberMe] = useState(false)
  const { signIn, signUp, user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!isLogin && !fullName) {
      toast.error('Please enter your full name')
      return
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Successfully logged in!')
      } else {
        const { error } = await signUp(email, password, fullName, userRole)
        if (error) throw error
        toast.success(
          'Sign up successful! Please verify your email if required.',
        )
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during authentication')
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setEmail('')
    setPassword('')
    setFullName('')
    setUserRole('user')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-display">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              type="button"
              className="font-medium text-market-green hover:text-market-green-dark"
              onClick={toggleMode}
            >
              {isLogin
                ? 'create a new account'
                : 'sign in to your existing account'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup
                    value={userRole}
                    onValueChange={setUserRole}
                    className="grid grid-cols-1 gap-2 pt-2"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="user" id="user" />
                      <Label
                        htmlFor="user"
                        className="cursor-pointer flex-grow"
                      >
                        <span className="font-medium">Customer</span>
                        <p className="text-sm text-gray-500">
                          I want to shop for fresh local produce
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label
                        htmlFor="vendor"
                        className="cursor-pointer flex-grow"
                      >
                        <span className="font-medium">Vendor</span>
                        <p className="text-sm text-gray-500">
                          I want to sell my produce in the marketplace
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-market-green hover:text-market-green-dark"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Auth
