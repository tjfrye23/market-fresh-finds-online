
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Edit, Save, X } from 'lucide-react'
import { Navigate } from 'react-router-dom'

const UserProfile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  })

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to a backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfile({
      fullName: user?.fullName || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-market-green rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.fullName}</CardTitle>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Role</Label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                    <p className="text-gray-900">Recently joined</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => window.location.href = '/orders'}
              variant="outline"
              className="w-full"
            >
              View My Orders
            </Button>
            {user.role === 'vendor' && (
              <>
                <Button 
                  onClick={() => window.location.href = '/vendor/dashboard'}
                  variant="outline"
                  className="w-full"
                >
                  Vendor Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/vendor/profile'}
                  variant="outline"
                  className="w-full"
                >
                  Manage Vendor Profile
                </Button>
                <Button 
                  onClick={() => window.location.href = '/vendor/manage-products'}
                  variant="outline"
                  className="w-full"
                >
                  Manage Products
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UserProfile
