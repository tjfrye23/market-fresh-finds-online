
import Navbar from '@/components/Navbar'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Calendar, Phone, Mail, Globe } from 'lucide-react'

const Markets = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <PageHeader
        title="Our Markets"
        description="Discover the Charlotte Regional Farmers Market - your premier destination for fresh, local produce and artisanal goods."
        image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Market Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-display text-market-green-dark">
                Charlotte Regional Farmers Market
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Located in the heart of Charlotte, the Charlotte Regional Farmers Market is the premier destination for fresh, locally-sourced produce, artisanal goods, and community connection. Our vibrant marketplace brings together the region's finest farmers, bakers, craftspeople, and food artisans under one roof.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-market-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700">
                      1801 Yorkmont Road<br />
                      Charlotte, NC 28208
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-market-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Market Hours</h3>
                    <div className="text-gray-700">
                      <p>Tuesday - Saturday: 6:00 AM - 6:00 PM</p>
                      <p>Sunday: 8:00 AM - 4:00 PM</p>
                      <p>Monday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-market-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
                    <p className="text-gray-700">
                      Phone: (704) 358-1914<br />
                      Email: info@charlotteregionalmarket.com
                    </p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start space-x-3">
                  <Globe className="h-6 w-6 text-market-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                    <a 
                      href="https://charlotteregionalmarket.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-market-green hover:text-market-green-dark transition-colors"
                    >
                      charlotteregionalmarket.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-market-green" />
                  <span>Year-Round Operation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Open 362 days a year, the Charlotte Regional Farmers Market provides consistent access to fresh, local produce regardless of the season. Our indoor facilities ensure shopping comfort in any weather.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-market-green" />
                  <span>Strategic Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Conveniently located near the Charlotte Douglas International Airport and major highways, our market serves as a distribution hub for fresh produce throughout the Southeast region.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What You'll Find */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-market-green-dark">
                What You'll Find at Our Market
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fresh Produce</h3>
                  <p className="text-gray-700 text-sm">
                    Seasonal fruits and vegetables from local and regional farms, ensuring peak freshness and flavor.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Artisanal Foods</h3>
                  <p className="text-gray-700 text-sm">
                    Locally-made breads, cheeses, preserves, and specialty food items crafted by regional artisans.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Plant & Garden</h3>
                  <p className="text-gray-700 text-sm">
                    Nursery plants, flowers, herbs, and gardening supplies to help you grow your own fresh produce.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prepared Foods</h3>
                  <p className="text-gray-700 text-sm">
                    Ready-to-eat meals, sandwiches, and beverages from local food vendors and restaurants.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Handcrafted Goods</h3>
                  <p className="text-gray-700 text-sm">
                    Unique crafts, artwork, and handmade items from talented local artists and craftspeople.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Seasonal Specialties</h3>
                  <p className="text-gray-700 text-sm">
                    Holiday decorations, pumpkins, Christmas trees, and other seasonal items throughout the year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display text-market-green-dark">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The Charlotte Regional Farmers Market serves as a vital link between local producers and consumers, fostering economic growth, supporting sustainable agriculture, and strengthening our community. We are committed to providing a welcoming space where people can access fresh, high-quality products while supporting local businesses and farmers.
              </p>
              <p className="text-gray-700">
                Whether you're a home cook looking for the freshest ingredients, a restaurant seeking quality produce, or a family wanting to experience the joy of a traditional farmers market, we welcome you to discover all that the Charlotte Regional Farmers Market has to offer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Markets
