
import ProductCard from '@/components/ProductCard'
import { Product } from '@/components/product/types'

interface Vendor {
  id: string
  user_id: string
  farm_name?: string
  vendor_name?: string
}

interface ProductGridProps {
  products: Product[]
  vendors: Vendor[]
  isLoading: boolean
}

const ProductGrid = ({ products, vendors, isLoading }: ProductGridProps) => {
  const getProductWithVendorInfo = (product: any) => {
    const vendor = vendors.find(v => v.user_id === product.user_id)
    return {
      ...product,
      farmName: vendor?.farm_name || vendor?.vendor_name
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productWithVendor = getProductWithVendorInfo(product)
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            unit={product.unit}
            image={
              product.image ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
            }
            organic={product.organic || false}
            local={product.local || false}
            farmName={productWithVendor.farmName}
          />
        )
      })}
    </div>
  )
}

export default ProductGrid
