import { Link } from 'react-router-dom'

interface CategoryCardProps {
  name: string
  image: string
  slug: string
}

const CategoryCard = ({ name, image, slug }: CategoryCardProps) => {
  return (
    <Link to={`/shop/category/${slug}`} className="block">
      <div className="relative overflow-hidden rounded-lg group">
        <div className="aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <h3 className="text-white font-display text-xl font-semibold">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
