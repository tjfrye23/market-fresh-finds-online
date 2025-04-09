
import { Link } from "react-router-dom";

interface FarmerCardProps {
  id: string;
  name: string;
  farmName: string;
  location: string;
  image: string;
  specialty: string;
}

const FarmerCard = ({ id, name, farmName, location, image, specialty }: FarmerCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative overflow-hidden h-72">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-market-green-dark">{name}</h3>
        <p className="text-market-green mb-2">{farmName}</p>
        <p className="text-gray-600 mb-3">{location}</p>
        <p className="text-gray-500 mb-4">Specialty: {specialty}</p>
        <Link to={`/farmers/${id}`} className="inline-block btn-primary">
          Meet {name.split(' ')[0]}
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
