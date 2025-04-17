
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, MapPin, Star, Store, MessageCircle, ShoppingBag } from "lucide-react";

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        // Fetch vendor profile data
        const { data, error } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching vendor:', error);
          throw error;
        }
        
        setVendor(data);
      } catch (error) {
        console.error('Unexpected error:', error);
        // If we can't find the vendor, we'll show a fallback
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorProducts = async () => {
      setLoadingProducts(true);
      try {
        // Get user_id from vendor profile
        const { data: vendorData } = await supabase
          .from('vendor_profiles')
          .select('user_id')
          .eq('id', id)
          .single();
        
        if (vendorData) {
          // Fetch products using the vendor's user_id
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', vendorData.user_id);
          
          if (error) {
            console.error('Error fetching products:', error);
            throw error;
          }
          
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (id) {
      fetchVendorData();
      fetchVendorProducts();
    }
  }, [id]);

  // Default image if none provided
  const defaultImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  // Loading state
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
    );
  }

  // If vendor not found
  if (!vendor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center p-12">
            <h1 className="text-3xl font-bold text-market-green-dark mb-4">Vendor Not Found</h1>
            <p className="text-lg mb-6">We couldn't find the vendor you're looking for.</p>
            <Link to="/farmers">
              <Button className="bg-market-green hover:bg-market-green-dark">
                Back to All Vendors
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="h-64 md:h-96 w-full relative">
          <img 
            src={vendor.image_url || defaultImage} 
            alt={vendor.farm_name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto -mt-16 relative z-10">
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle className="text-3xl font-display text-market-green-dark">
                      {vendor.farm_name}
                    </CardTitle>
                    <CardDescription className="text-xl mt-1">
                      Owned by {vendor.owner_name}
                    </CardDescription>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="flex items-center text-yellow-500 mr-2">
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <span className="text-gray-600">(5.0)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-market-green mr-2" />
                  <span>{vendor.location || "California"}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <Store className="h-5 w-5 text-market-green mr-2" />
                  <span>Specialty: {vendor.specialty || "Fresh Produce"}</span>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-market-green-dark mb-2">About {vendor.farm_name}</h3>
                  <p className="text-gray-700">
                    {vendor.description || 
                      `${vendor.farm_name} is committed to sustainable farming practices and bringing the freshest produce to your table. ${vendor.owner_name} has been farming for over 10 years and takes pride in growing the highest quality crops.`}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 my-6">
                  <Button className="bg-market-green hover:bg-market-green-dark">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop Products
                  </Button>
                  <Button variant="outline" className="border-market-green text-market-green hover:bg-market-green/10">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Products section */}
            <div className="mt-10">
              <h2 className="text-2xl font-display font-semibold text-market-green-dark mb-6">
                Products from {vendor.farm_name}
              </h2>
              
              {loadingProducts ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-market-green" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>${product.price.toFixed(2)} / {product.unit}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-market-green hover:bg-market-green-dark">
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">No products available from this vendor yet.</p>
                  <Link to="/shop">
                    <Button className="bg-market-green hover:bg-market-green-dark">
                      Browse All Products
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorDetail;
