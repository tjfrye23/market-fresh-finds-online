
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DesktopNavLinks from "./navbar/DesktopNavLinks";
import UserActions from "./navbar/UserActions";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      
      // Convert 'farmer' database role to 'vendor' in the UI
      if (data?.role === 'farmer') {
        return 'vendor';
      }
      
      return data?.role as 'user' | 'vendor' | 'admin' | null;
    },
    enabled: !!user,
  });

  const isVendor = userRole === 'vendor';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-market-green-dark font-display text-2xl font-bold">Market Fresh</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavLinks isVendor={isVendor} />

          {/* Shopping Cart, Auth, and Mobile Menu Button */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="ml-2 p-2 rounded-md text-gray-700 md:hidden focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        isVendor={isVendor}
        isLoggedIn={!!user}
        onClose={closeMenu}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onVendorSignup={navigateToVendorOnboarding}
      />
    </nav>
  );
};

export default Navbar;
