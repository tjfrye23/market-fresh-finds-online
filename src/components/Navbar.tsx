
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X, Home, Apple, Users, Book, LogIn, LogOut, User, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data?.role;
    },
    enabled: !!user,
  });

  const isFarmer = userRole === 'farmer';

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
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="flex items-center text-gray-700 hover:text-market-green transition-colors">
              <Home className="mr-1 h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/shop" className="flex items-center text-gray-700 hover:text-market-green transition-colors">
              <Apple className="mr-1 h-4 w-4" />
              <span>Shop</span>
            </Link>
            <Link to="/about" className="flex items-center text-gray-700 hover:text-market-green transition-colors">
              <Book className="mr-1 h-4 w-4" />
              <span>About Us</span>
            </Link>
            <Link to="/farmers" className="flex items-center text-gray-700 hover:text-market-green transition-colors">
              <Users className="mr-1 h-4 w-4" />
              <span>Our Farmers</span>
            </Link>
            {isFarmer && (
              <Link to="/manage-products" className="flex items-center text-market-green-dark hover:text-market-green transition-colors">
                <Package className="mr-1 h-4 w-4" />
                <span>Manage Products</span>
              </Link>
            )}
          </div>

          {/* Shopping Cart, Auth, and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Link to="/cart" className="p-2 text-gray-700 hover:text-market-green transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {user ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 hidden md:flex">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-market-green text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="hidden md:flex items-center ml-2"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogin} 
                className="hidden md:flex items-center"
              >
                <LogIn className="mr-1 h-4 w-4" />
                <span>Login</span>
              </Button>
            )}

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
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Apple className="mr-2 h-5 w-5" />
                <span>Shop</span>
              </div>
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                <span>About Us</span>
              </div>
            </Link>
            <Link
              to="/farmers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span>Our Farmers</span>
              </div>
            </Link>
            
            {isFarmer && (
              <Link
                to="/manage-products"
                className="block px-3 py-2 rounded-md text-base font-medium text-market-green-dark hover:text-market-green-dark hover:bg-gray-50"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  <span>Manage Products</span>
                </div>
              </Link>
            )}
            
            {/* Authentication for Mobile */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Logout</span>
                </div>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  <span>Login</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
