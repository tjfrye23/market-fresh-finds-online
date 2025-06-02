
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CATEGORIES } from './productConstants'
import { Product } from './types'
import { deleteProduct } from '@/services/mockServices'

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  isLoading: boolean
}

const ProductList = ({ products, onEdit, isLoading }: ProductListProps) => {
  const queryClient = useQueryClient()

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await deleteProduct(productId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] })
      toast.success('Product deleted')
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading your products...</div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start adding your products to the marketplace by clicking the button
          above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Features</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="flex items-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">{product.unit}</div>
                </div>
              </TableCell>
              <TableCell>
                ${parseFloat(product.price.toString()).toFixed(2)}
              </TableCell>
              <TableCell>
                {CATEGORIES.find((c) => c.value === product.category)?.label ||
                  product.category}
              </TableCell>
              <TableCell>
                <span className={`${product.stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {product.organic && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Organic
                    </span>
                  )}
                  {product.local && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Local
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductList
