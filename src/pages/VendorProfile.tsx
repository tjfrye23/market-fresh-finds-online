import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ImageUploader from '@/components/ImageUploader'
import { 
  Loader2, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  ExternalLink,
  ArrowLeft,
  MapPin,
  Store
} from 'lucide-react'
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
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    status: 'pending'
  })
  const [isNewProfile, setIsNewProfile] = useState(true)

  // Default image if none provided
  const defaultImage =
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

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

  // Helper function to format social media URLs
  const formatSocialUrl = (platform: string, handle: string) => {
    if (!handle) return ''
    
    // If it's already a full URL, return as is
    if (handle.startsWith('http')) return handle
    
    // Remove @ symbol if present
    const cleanHandle = handle.replace('@', '')
    
    switch (platform) {
      case 'facebook':
        return `https://facebook.com/${cleanHandle}`
      case 'instagram':
        return `https://instagram.com/${cleanHandle}`
      case 'twitter':
        return `https://twitter.com/${cleanHandle}`
      default:
        return handle
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-market-green mb-4" />
            <p className="text-lg">Loading vendor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Back to Dashboard and Edit Profile Buttons */}
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link to="/vendor/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            {!isNewProfile && !isEditing && (
              <Button
                onClick={startEditing}
                className="bg-market-green hover:bg-market-green-dark"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="h-64 md:h-96 w-full relative">
          <img
            src={profile.image_url || defaultImage}
            alt={profile.vendor_name || 'Vendor'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto -mt-16 relative z-10">
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="text-center">
                  <CardTitle className="text-3xl font-display text-market-green-dark">
                    {profile.vendor_name || 'Your Farm/Business'}
                  </CardTitle>
                  <CardDescription className="text-xl mt-1">
                    Owned by {profile.owner_name || 'You'}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
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

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-market-green-dark">Online Presence</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={profile.website || ''}
                          onChange={handleChange}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          value={profile.facebook || ''}
                          onChange={handleChange}
                          placeholder="facebook.com/yourpage or @yourpage"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={profile.instagram || ''}
                          onChange={handleChange}
                          placeholder="instagram.com/yourpage or @yourpage"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          value={profile.twitter || ''}
                          onChange={handleChange}
                          placeholder="twitter.com/yourpage or @yourpage"
                        />
                      </div>
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
                  <div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 text-market-green mr-2" />
                      <span>{profile.location || 'California'}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-6">
                      <Store className="h-5 w-5 text-market-green mr-2" />
                      <span>Specialty: {profile.specialty || 'Fresh Produce'}</span>
                    </div>

                    {/* Website and Social Media Links - Always show this section */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-market-green-dark mb-3">
                        Connect with {profile.vendor_name || 'Us'}
                      </h3>
                      {(profile.website || profile.facebook || profile.instagram || profile.twitter) ? (
                        <div className="flex flex-wrap gap-3">
                          {profile.website && (
                            <a
                              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
                            >
                              <Globe className="h-4 w-4" />
                              <span>Website</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          
                          {profile.facebook && (
                            <a
                              href={formatSocialUrl('facebook', profile.facebook)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 hover:text-blue-900"
                            >
                              <Facebook className="h-4 w-4" />
                              <span>Facebook</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          
                          {profile.instagram && (
                            <a
                              href={formatSocialUrl('instagram', profile.instagram)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-pink-700 hover:text-pink-900"
                            >
                              <Instagram className="h-4 w-4" />
                              <span>Instagram</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          
                          {profile.twitter && (
                            <a
                              href={formatSocialUrl('twitter', profile.twitter)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors text-sky-700 hover:text-sky-900"
                            >
                              <Twitter className="h-4 w-4" />
                              <span>Twitter</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No website or social media links added yet. Click "Edit Profile" to add them.
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-market-green-dark mb-2">
                        About {profile.vendor_name || 'Us'}
                      </h3>
                      <p className="text-gray-700">
                        {profile.description ||
                          `${profile.vendor_name || 'This farm'} is committed to sustainable farming practices and bringing the freshest produce to your table. ${profile.owner_name || 'We'} take pride in growing the highest quality crops.`}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default VendorProfile
