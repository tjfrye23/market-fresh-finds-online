
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import { Loader2 } from "lucide-react";

interface VendorProfile {
  id?: string;
  user_id?: string;
  farm_name: string;
  owner_name: string;
  location: string;
  specialty: string;
  description: string;
  image_url: string | null;
}

const VendorProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<VendorProfile>({
    farm_name: "",
    owner_name: "",
    location: "",
    specialty: "",
    description: "",
    image_url: null
  });
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchVendorProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setIsNewProfile(false);
        }
      } catch (error: any) {
        console.error("Error fetching vendor profile:", error.message);
        toast.error("Could not load your vendor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setProfile((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleImageRemoved = () => {
    setProfile((prev) => ({ ...prev, image_url: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to save your profile");
      return;
    }
    
    if (!profile.farm_name || !profile.owner_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    
    try {
      if (isNewProfile) {
        // Insert new profile
        const { error } = await supabase
          .from("vendor_profiles")
          .insert({
            ...profile,
            user_id: user.id,
          });
        
        if (error) throw error;
        
        toast.success("Vendor profile created successfully!");
        setIsNewProfile(false);
      } else {
        // Update existing profile
        const { error } = await supabase
          .from("vendor_profiles")
          .update(profile)
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        toast.success("Vendor profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Error saving vendor profile:", error.message);
      toast.error("Failed to save vendor profile");
    } finally {
      setSaving(false);
    }
  };

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
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title={isNewProfile ? "Create Your Vendor Profile" : "Manage Your Vendor Profile"} 
          description="Share information about your farm and products with our customers"
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="farm_name" className="text-base">
                  Farm/Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="farm_name"
                  name="farm_name"
                  value={profile.farm_name}
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
                  value={profile.owner_name}
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
                  value={profile.location || ""}
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
                  value={profile.specialty || ""}
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
                  value={profile.description || ""}
                  onChange={handleChange}
                  placeholder="Tell customers about your farm, your growing practices, your story..."
                  rows={5}
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-base">
                  Farm/Business Image
                </Label>
                <ImageUploader
                  existingImageUrl={profile.image_url}
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                />
              </div>
              
              <div className="pt-4 flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/manage-products")} 
                  type="button"
                  className="w-1/2"
                >
                  Cancel
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
                    isNewProfile ? "Create Profile" : "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorProfile;
