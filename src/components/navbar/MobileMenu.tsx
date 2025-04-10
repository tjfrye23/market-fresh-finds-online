
import { Link } from "react-router-dom";
import { 
  Home, Apple, Book, Users, Package, 
  LogIn, LogOut, Wheat
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  isVendor: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onVendorSignup: () => void;
}

const MobileMenu = ({
  isOpen,
  isVendor,
  isLoggedIn,
  onClose,
  onLogin,
  onLogout,
  onVendorSignup
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white">
      <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
        <Link
          to="/"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <div className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            <span>Home</span>
          </div>
        </Link>
        <Link
          to="/shop"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <div className="flex items-center">
            <Apple className="mr-2 h-5 w-5" />
            <span>Shop</span>
          </div>
        </Link>
        <Link
          to="/about"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <div className="flex items-center">
            <Book className="mr-2 h-5 w-5" />
            <span>About Us</span>
          </div>
        </Link>
        <Link
          to="/farmers"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <span>Our Vendors</span>
          </div>
        </Link>
        
        {isVendor && (
          <Link
            to="/manage-products"
            className="block px-3 py-2 rounded-md text-base font-medium text-market-green-dark hover:text-market-green-dark hover:bg-gray-50"
            onClick={onClose}
          >
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              <span>Manage Products</span>
            </div>
          </Link>
        )}
        
        {/* Authentication for Mobile */}
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </div>
          </button>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
            >
              <div className="flex items-center">
                <LogIn className="mr-2 h-5 w-5" />
                <span>Login</span>
              </div>
            </button>
            <button
              onClick={onVendorSignup}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-market-green hover:text-market-green-dark hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Wheat className="mr-2 h-5 w-5" />
                <span>Join as a Vendor</span>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
