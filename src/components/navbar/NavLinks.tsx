
import { Link } from 'react-router-dom'
import {
  Home,
  Apple,
  Book,
  Users,
  Wheat,
  Settings,
  LogIn,
  LogOut,
  Package,
  BarChart3,
} from 'lucide-react'

interface NavLinksProps {
  isVendor: boolean
  isLoggedIn: boolean
  isAdmin: boolean
  onClose: () => void
  onLogin: () => void
  onLogout: () => void
  onVendorSignup: () => void
}

const NavLinks = ({
  isVendor,
  isLoggedIn,
  isAdmin,
  onClose,
  onLogin,
  onLogout,
  onVendorSignup,
}: NavLinksProps) => {
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <Link
          to="/"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <Home className="mr-2 h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <Apple className="mr-2 h-5 w-5" />
          <span>Shop</span>
        </Link>

        <Link
          to="/about"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <Book className="mr-2 h-5 w-5" />
          <span>About Us</span>
        </Link>

        <Link
          to="/vendors"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          onClick={onClose}
        >
          <Users className="mr-2 h-5 w-5" />
          <span>Our Vendors</span>
        </Link>

        {isLoggedIn && (
          <Link
            to="/orders"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
            onClick={onClose}
          >
            <Package className="mr-2 h-5 w-5" />
            <span>My Orders</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
            onClick={onClose}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span>Admin Dashboard</span>
          </Link>
        )}

        {isVendor && (
          <>
            <Link
              to="/vendor/dashboard"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-market-green-dark hover:text-market-green-dark hover:bg-gray-50"
              onClick={onClose}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              <span>Vendor Dashboard</span>
            </Link>
            <Link
              to="/vendor/profile"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-market-green-dark hover:text-market-green-dark hover:bg-gray-50"
              onClick={onClose}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Manage Shop Profile</span>
            </Link>
          </>
        )}
      </div>

      <div className="pt-2 border-t border-gray-200">
        {isLoggedIn ? (
          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                onLogin()
                onClose()
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-market-green-dark hover:bg-gray-50"
            >
              <LogIn className="mr-2 h-5 w-5" />
              <span>Login</span>
            </button>

            <button
              onClick={() => {
                onVendorSignup()
                onClose()
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-market-green hover:text-market-green-dark hover:bg-gray-50"
            >
              <Wheat className="mr-2 h-5 w-5" />
              <span>Join as a Vendor</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default NavLinks
