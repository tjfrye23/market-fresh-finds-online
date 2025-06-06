import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import VendorCard from '@/components/VendorCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getVendors } from '@/services/mockServices'

interface Vendor {
  id: string
  vendor_name: string
  owner_name: string
  location: string | null
  image_url: string | null
  specialty: string | null
}

const Vendors = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })

  // Update sample vendors to use the correct property names that match VendorsCardProps
  const sampleVendors = [
    {
      id: '1',
      owner_name: 'Emma Rodriguez',
      vendor_name: 'Sunshine Orchards',
      location: 'Meadowville, CA',
      image_url:
        'https://images.unsplash.com/photo-1520052203542-d3095f1b6cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      specialty: 'Organic Fruits & Berries',
    },
    {
      id: '2',
      owner_name: 'Michael Chen',
      vendor_name: 'Green Valley Farm',
      location: 'Riverdale, CA',
      image_url:
        'https://images.unsplash.com/photo-1621916805571-ed8f78673a0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80',
      specialty: 'Heirloom Vegetables',
    },
    {
      id: '3',
      owner_name: 'Sarah Johnson',
      vendor_name: 'Hill & Dale Dairy',
      location: 'Oakridge, CA',
      image_url:
        'https://images.unsplash.com/photo-1573497019236-61f323985466?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      specialty: 'Artisanal Cheeses & Dairy Products',
    },
    {
      id: '4',
      owner_name: 'James Wilson',
      vendor_name: 'Willow Creek Bakery',
      location: 'Pinegrove, CA',
      image_url:
        'https://images.unsplash.com/photo-1591688442527-894307a5226d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      specialty: 'Sourdough Breads & Pastries',
    },
    {
      id: '5',
      owner_name: 'David Sanchez',
      vendor_name: 'Sunrise Poultry',
      location: 'Clearwater, CA',
      image_url:
        'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      specialty: 'Free-Range Eggs & Poultry',
    },
    {
      id: '6',
      owner_name: 'Amanda Taylor',
      vendor_name: 'Sweet Bee Apiary',
      location: 'Sunnyside, CA',
      image_url:
        'https://images.unsplash.com/photo-1533323905636-7f0bfa0ba5ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      specialty: 'Honey & Bee Products',
    },
  ]

  const handleVendorSignup = () => {
    if (user) {
      navigate('/vendor-profile')
    } else {
      navigate('/vendor-onboarding')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader
          title="Meet Our Vendors"
          description="The passionate people behind our fresh, local products"
          image="https://images.unsplash.com/photo-1618982469792-bd2270c20228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
        />

        <div className="container mx-auto px-4 py-8">
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-market-green-dark mb-4">
                The Heart of Our Market
              </h2>
              <p className="text-lg text-gray-700">
                Our vendors are the backbone of Market Fresh. Each one brings
                unique skills, knowledge, and passion to their craft, resulting
                in the exceptional quality and variety you'll find at our
                market. Get to know the people who grow your food!
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-market-green" />
                <span className="ml-2">Loading vendors...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vendors && vendors.length > 0
                  ? vendors.map((vendor) => (
                      <VendorCard key={vendor.id} {...vendor} />
                    ))
                  : sampleVendors.map((farmer) => (
                      <VendorCard key={farmer.id} {...farmer} />
                    ))}
              </div>
            )}
          </section>

          <section className="mb-16 bg-market-brown-light/20 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-display font-bold text-market-green-dark mb-4">
                  Become a Market Fresh Farmer
                </h2>
                <p className="text-gray-700 mb-4">
                  Are you a local farmer or artisanal food producer? We're
                  always looking to expand our community of vendors. Join us at
                  Market Fresh and connect directly with customers who value
                  quality, sustainability, and community.
                </p>
                <ul className="list-disc pl-5 text-gray-700 mb-6">
                  <li>
                    Access to an established customer base passionate about
                    local food
                  </li>
                  <li>Fair pricing that respects your work and expertise</li>
                  <li>Marketing support to help tell your story</li>
                  <li>A community of like-minded producers and customers</li>
                </ul>
                <Button
                  className="bg-market-green hover:bg-market-green-dark"
                  onClick={handleVendorSignup}
                >
                  Apply to Become a Vendor
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1459262566483-35e108d93f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Farmer in field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Vendors
