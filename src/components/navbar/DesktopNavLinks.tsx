
import NavbarLink from "./NavbarLink";
import { Home, Apple, Book, Users, Package } from "lucide-react";

interface DesktopNavLinksProps {
  isVendor: boolean;
}

const DesktopNavLinks = ({ isVendor }: DesktopNavLinksProps) => {
  return (
    <div className="hidden md:flex space-x-8">
      <NavbarLink to="/" icon={Home} label="Home" />
      <NavbarLink to="/shop" icon={Apple} label="Shop" />
      <NavbarLink to="/about" icon={Book} label="About Us" />
      <NavbarLink to="/farmers" icon={Users} label="Our Vendors" />
      {isVendor && (
        <NavbarLink
          to="/manage-products"
          icon={Package}
          label="Manage Your Shop"
          isHighlighted
        />
      )}
    </div>
  );
};

export default DesktopNavLinks;
