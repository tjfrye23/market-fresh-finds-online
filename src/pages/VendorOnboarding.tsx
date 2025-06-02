
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import { useNavigate } from 'react-router-dom'

const VendorOnboarding = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [farmName, setFarmName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !fullName || !farmName) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Always set the role as "vendor" for users signing up through this page
      const { error } = await signUp(
        email,
        password,
        fullName,
        'vendor', // Explicitly set role to vendor
      )

      if (error) throw error

      toast.success(
        'Vendor account created! Your profile is pending admin review. You will be notified once approved.',
      )
      navigate('/vendor/profile')
    } catch (error) {
      toast.error(error.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Become a Vendor"
        description="Create your vendor account to start selling your fresh produce on Market Fresh"
      />

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Review Process</h3>
          <p className="text-sm text-yellow-700">
            After creating your account, your vendor profile will be reviewed by our admin team. 
            Once approved, your products will be visible to customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmName">Vendor Name</Label>
            <Input
              id="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Your vendor name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="pt-4 flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              type="button"
              disabled={loading}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-market-green hover:bg-market-green-dark w-1/2"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Vendor Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VendorOnboarding
