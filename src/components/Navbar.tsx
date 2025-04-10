
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UserActions from "./navbar/UserActions";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLinks from "./navbar/NavLinks";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data?.role as 'user' | 'vendor' | 'admin' | null;
    },
    enabled: !!user,
  });

  const isVendor = userRole === 'vendor';

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
    closeMenu();
  };

  const navigateToVendorOnboarding = () => {
    navigate("/vendor-onboarding");
    closeMenu();
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const email = user.email || "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-market-green-dark font-display text-2xl font-bold">Market Fresh</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/cart" className="p-2 text-gray-700 hover:text-market-green transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            <UserActions 
              user={user}
              getUserInitials={getUserInitials}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              navigateToVendorOnboarding={navigateToVendorOnboarding}
            />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md text-gray-700 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px] pt-14">
                <NavLinks 
                  isVendor={isVendor} 
                  isLoggedIn={!!user}
                  onClose={() => setIsOpen(false)}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onVendorSignup={navigateToVendorOnboarding}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
