
import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X, Home, Apple, Users, Book } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
          </div>

          {/* Shopping Cart and Mobile Menu Button */}
          <div className="flex items-center">
            <Link to="/cart" className="p-2 text-gray-700 hover:text-market-green transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>

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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
