import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FarmerCard from "@/components/FarmerCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface Vendor {
  id: string;
  farm_name: string;
  owner_name: string;
  location: string | null;
  image_url: string | null;
  specialty: string | null;
}

const Farmers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('id, farm_name, owner_name, location, image_url, specialty');
      
      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }
      
      return data as Vendor[];
    },
  });

  const sampleFarmers = [
    {
      id: "1",
      owner_name: "Emma Rodriguez",
      farm_name: "Sunshine Orchards",
      location: "Meadowville, CA",
      image_url: "https://images.unsplash.com/photo-1520052203542-d3095f1b6cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      specialty: "Organic Fruits & Berries",
    },
    {
      id: "2",
      owner_name: "Michael Chen",
      farm_name: "Green Valley Farm",
      location: "Riverdale, CA",
      image_url: "https://images.unsplash.com/photo-1621916805571-ed8f78673a0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80",
      specialty: "Heirloom Vegetables",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      farmName: "Hill & Dale Dairy",
      location: "Oakridge, CA",
      image: "https://images.unsplash.com/photo-1573497019236-61f323985466?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      specialty: "Artisanal Cheeses & Dairy Products",
    },
    {
      id: "4",
      name: "James Wilson",
      farmName: "Willow Creek Bakery",
      location: "Pinegrove, CA",
      image: "https://images.unsplash.com/photo-1591688442527-894307a5226d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      specialty: "Sourdough Breads & Pastries",
    },
    {
      id: "5",
      name: "David Sanchez",
      farmName: "Sunrise Poultry",
      location: "Clearwater, CA",
      image: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      specialty: "Free-Range Eggs & Poultry",
    },
    {
      id: "6",
      name: "Amanda Taylor",
      farmName: "Sweet Bee Apiary",
      location: "Sunnyside, CA",
      image: "https://images.unsplash.com/photo-1533323905636-7f0bfa0ba5ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      specialty: "Honey & Bee Products",
    },
  ];

  const handleVendorSignup = () => {
    if (user) {
      navigate("/vendor-profile");
    } else {
      navigate("/vendor-onboarding");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Meet Our Farmers" 
          description="The passionate people behind our fresh, local products"
          image="https://images.unsplash.com/photo-1618982469792-bd2270c20228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
        />

        <div className="container mx-auto px-4 py-8">
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-market-green-dark mb-4">The Heart of Our Market</h2>
              <p className="text-lg text-gray-700">
                Our farmers are the backbone of Market Fresh. Each one brings unique skills, knowledge, and passion to their craft, resulting in the exceptional quality and variety you'll find at our market. Get to know the people who grow your food!
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-market-green" />
                <span className="ml-2">Loading vendors...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(vendors && vendors.length > 0) ? (
                  vendors.map((vendor) => (
                    <FarmerCard key={vendor.id} {...vendor} />
                  ))
                ) : (
                  sampleFarmers.map((farmer) => (
                    <FarmerCard key={farmer.id} {...farmer} />
                  ))
                )}
              </div>
            )}
          </section>

          <section className="mb-16 bg-market-brown-light/20 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-display font-bold text-market-green-dark mb-4">Become a Market Fresh Farmer</h2>
                <p className="text-gray-700 mb-4">
                  Are you a local farmer or artisanal food producer? We're always looking to expand our community of vendors. Join us at Market Fresh and connect directly with customers who value quality, sustainability, and community.
                </p>
                <ul className="list-disc pl-5 text-gray-700 mb-6">
                  <li>Access to an established customer base passionate about local food</li>
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

          <section className="mb-16">
            <h2 className="text-3xl font-display font-bold text-market-green-dark text-center mb-12">Farm Tours & Events</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Farm Tour" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Farm Tours</h3>
                  <p className="text-gray-600 mb-4">
                    See where your food is grown! Join our monthly farm tours and connect with our farmers on their home turf.
                  </p>
                  <Button className="bg-market-green hover:bg-market-green-dark w-full">See Schedule</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1505235687583-28b19bda290d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Cooking Workshops" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Cooking Workshops</h3>
                  <p className="text-gray-600 mb-4">
                    Learn to prepare delicious, seasonal meals with ingredients from our market in these hands-on classes.
                  </p>
                  <Button className="bg-market-green hover:bg-market-green-dark w-full">Register Now</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1464062566483-35e108d93f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
                    alt="Seasonal Festivals" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Seasonal Festivals</h3>
                  <p className="text-gray-600 mb-4">
                    Celebrate the bounty of each season at our quarterly festivals featuring food, music, and family activities.
                  </p>
                  <Button className="bg-market-green hover:bg-market-green-dark w-full">View Events</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Farmers;
