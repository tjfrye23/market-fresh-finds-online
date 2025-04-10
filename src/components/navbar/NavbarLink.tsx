
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavbarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const NavbarLink = ({ to, icon: Icon, label, isHighlighted = false, onClick }: NavbarLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center ${isHighlighted ? "text-market-green-dark hover:text-market-green" : "text-gray-700 hover:text-market-green"} transition-colors`}
      onClick={onClick}
    >
      <Icon className="mr-1 h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

export default NavbarLink;
