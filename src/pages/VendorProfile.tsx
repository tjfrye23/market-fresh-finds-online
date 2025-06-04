import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ImageUploader from '@/components/ImageUploader'
import { Loader2, Edit, Save, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { getVendorByUserId, saveVendorProfile, updateVendorStatus } from '@/services/mockServices'
import { MockVendorProfile } from '@/data/mockData'

const VendorProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Partial<MockVendorProfile>>({
    vendor_name: '',
    owner_name: '',
    location: '',
    specialty: '',
    description: '',
    image_url: null,
    status: 'pending'
  })
  const [isNewProfile, setIsNewProfile] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const fetchVendorProfile = async () => {
      try {
        const data = await getVendorByUserId(user.id)
        if (data) {
          setProfile(data)
          setIsNewProfile(false)
        } else {
          // New vendor profile defaults to pending status
          setProfile(prev => ({ ...prev, status: 'pending' }))
        }
      } catch (error) {
        console.error('Error fetching vendor profile:', error)
        toast.error('Could not load your vendor profile')
      } finally {
        setLoading(false)
      }
    }

    fetchVendorProfile()
  }, [user, navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (imageUrl: string) => {
    setProfile((prev) => ({ ...prev, image_url: imageUrl }))
  }

  const handleImageRemoved = () => {
    setProfile((prev) => ({ ...prev, image_url: null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('You must be logged in to save your profile')
      return
    }

    if (!profile.vendor_name || !profile.owner_name) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const savedProfile = await saveVendorProfile(profile, user.id)
      setProfile(savedProfile)
      toast.success(isNewProfile ? 'Vendor profile created successfully! Your profile is now pending admin review.' : 'Vendor profile updated successfully!')
      setIsNewProfile(false)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving vendor profile:', error)
      toast.error('Failed to save vendor profile')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusUpdate = async (newStatus: 'active' | 'rejected') => {
    if (!user || user.role !== 'admin') {
      toast.error('Only admins can update vendor status')
      return
    }

    try {
      await updateVendorStatus(profile.id!, newStatus)
      setProfile(prev => ({ ...prev, status: newStatus }))
      toast.success(`Vendor status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating vendor status:', error)
      toast.error('Failed to update vendor status')
    }
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (!isNewProfile && user) {
      setLoading(true)
      getVendorByUserId(user.id)
        .then((data) => {
          if (data) {
            setProfile(data)
          }
          setLoading(false)
        })
        .catch((error) => {
          toast.error('Could not reload your profile')
          console.error(error)
          setLoading(false)
        })
    }
    setIsEditing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-market-green" />
          <span className="ml-2">Loading vendor profile...</span>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader
          title={
            isNewProfile
              ? 'Create Your Vendor Profile'
              : 'Manage Your Vendor Profile'
          }
          description="Share information about your farm and products with our customers"
        />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            {/* Status Banner */}
            {!isNewProfile && (
              <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${getStatusColor(profile.status || 'pending')}`}>
                {getStatusIcon(profile.status || 'pending')}
                <div>
                  <p className="font-medium">
                    Profile Status: {profile.status === 'active' ? 'Active' : profile.status === 'pending' ? 'Pending Review' : 'Rejected'}
                  </p>
                  <p className="text-sm">
                    {profile.status === 'active' && 'Your profile is approved and products are visible to customers.'}
                    {profile.status === 'pending' && 'Your profile is under admin review. Products will be visible once approved.'}
                    {profile.status === 'rejected' && 'Your profile was rejected. Please contact support for more information.'}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {user?.role === 'admin' && !isNewProfile && profile.status === 'pending' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-3">Admin Actions</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusUpdate('active')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Vendor
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reject Vendor
                  </Button>
                </div>
              </div>
            )}

            {isNewProfile || isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="vendor_name" className="text-base">
                    Farm/Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vendor_name"
                    name="vendor_name"
                    value={profile.vendor_name || ''}
                    onChange={handleChange}
                    placeholder="Your farm or business name"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="owner_name" className="text-base">
                    Owner Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="owner_name"
                    name="owner_name"
                    value={profile.owner_name || ''}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="location" className="text-base">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="specialty" className="text-base">
                    Specialty
                  </Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={profile.specialty || ''}
                    onChange={handleChange}
                    placeholder="E.g., Organic Vegetables, Artisanal Cheeses, etc."
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="description" className="text-base">
                    About Your Farm/Business
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={profile.description || ''}
                    onChange={handleChange}
                    placeholder="Tell customers about your farm, your growing practices, your story..."
                    rows={5}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Farm/Business Image</Label>
                  <ImageUploader
                    existingImageUrl={profile.image_url}
                    onImageUploaded={handleImageUploaded}
                    onImageRemoved={handleImageRemoved}
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={
                      isNewProfile
                        ? () => navigate('/vendor/dashboard')
                        : cancelEditing
                    }
                    type="button"
                    className="w-1/2"
                  >
                    {isNewProfile ? (
                      'Cancel'
                    ) : (
                      <>
                        <X className="mr-2" />
                        Cancel Editing
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-market-green hover:bg-market-green-dark w-1/2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" />
                        {isNewProfile ? 'Create Profile' : 'Save Changes'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              // View mode display
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-market-green-dark">
                      {profile.vendor_name}
                    </h2>
                    <p className="text-lg text-gray-700">
                      Owned by {profile.owner_name}
                    </p>
                    {profile.location && (
                      <p className="text-gray-600 mt-1">{profile.location}</p>
                    )}
                  </div>
                  <Button
                    onClick={startEditing}
                    className="bg-market-green hover:bg-market-green-dark"
                  >
                    <Edit className="mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {profile.image_url && (
                  <div className="rounded-lg overflow-hidden shadow-md h-64 w-full">
                    <img
                      src={profile.image_url}
                      alt={profile.vendor_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {profile.specialty && (
                  <div>
                    <h3 className="text-lg font-semibold text-market-green-dark">
                      Specialty
                    </h3>
                    <p className="text-gray-700">{profile.specialty}</p>
                  </div>
                )}

                {profile.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-market-green-dark">
                      About Us
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {profile.description}
                    </p>
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    onClick={() => navigate('/vendor/dashboard')}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default VendorProfile
