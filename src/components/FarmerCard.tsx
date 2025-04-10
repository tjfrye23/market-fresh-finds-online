
import { Link } from "react-router-dom";

interface FarmerCardProps {
  id: string;
  owner_name: string;
  farm_name: string;
  location: string | null;
  image_url: string | null;
  specialty: string | null;
}

const FarmerCard = ({ id, owner_name, farm_name, location, image_url, specialty }: FarmerCardProps) => {
  // Default image if none provided
  const defaultImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative overflow-hidden h-72">
        <img 
          src={image_url || defaultImage} 
          alt={farm_name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-market-green-dark">{owner_name}</h3>
        <p className="text-market-green mb-2">{farm_name}</p>
        <p className="text-gray-600 mb-3">{location || "California"}</p>
        <p className="text-gray-500 mb-4">Specialty: {specialty || "Fresh Produce"}</p>
        <Link to={`/farmers/${id}`} className="inline-block btn-primary">
          Meet {owner_name.split(' ')[0]}
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
