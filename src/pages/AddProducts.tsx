import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductForm from '@/components/product/ProductForm'
import { Button } from '@/components/ui/button'
import { PlusCircle, ArrowLeft, Save } from 'lucide-react'
import { Product, ProductFormValues } from '@/components/product/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addProduct } from '@/services/mockServices'

const AddProducts = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [products, setProducts] = useState<ProductFormValues[]>([])
  const [currentProduct, setCurrentProduct] =
    useState<ProductFormValues | null>(null)
  const [showForm, setShowForm] = useState(true)

  const addProductMutation = useMutation({
    mutationFn: async (products: ProductFormValues[]) => {
      const results = []
      for (const productData of products) {
        const result = await addProduct({
          name: productData.name,
          price: parseFloat(productData.price),
          unit: productData.unit,
          category: productData.category,
          description: productData.description || null,
          image: productData.image || null,
          organic: productData.organic,
          local: productData.local,
          user_id: user?.id || '',
        })
        results.push(result)
      }
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] })
      toast.success(`${products.length} products successfully added`)
      navigate('/manage-products')
    },
    onError: (error) => {
      console.error('Error saving products:', error)
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleProductSubmit = (values: ProductFormValues) => {
    setProducts([...products, values])
    setCurrentProduct(null)
    setShowForm(false)
    toast.success(`"${values.name}" added to queue`)
  }

  const handleAddAnother = () => {
    setShowForm(true)
    setCurrentProduct(null)
  }

  const handleSaveAll = () => {
    if (products.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    addProductMutation.mutate(products)
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products]
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  const handleEditProduct = (index: number) => {
    setCurrentProduct(products[index])
    setShowForm(true)
    // Remove the product from the queue so it can be edited and re-added
    const updatedProducts = [...products]
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader
          title="Add New Products"
          description="Add products to your shop"
          image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        />

        <div className="page-container py-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/manage-products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleAddAnother}
                className="flex items-center gap-2"
                disabled={showForm}
              >
                <PlusCircle className="h-4 w-4" />
                Add Another Product
              </Button>
              <Button
                onClick={handleSaveAll}
                className="flex items-center gap-2"
                disabled={products.length === 0 || addProductMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {addProductMutation.isPending
                  ? 'Saving...'
                  : 'Save All Products'}
              </Button>
            </div>
          </div>

          {showForm ? (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <div className="overflow-visible">
                <ProductForm
                  editingProduct={null}
                  initialValues={currentProduct || undefined}
                  onSuccess={handleProductSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setCurrentProduct(null)
                  }}
                  submitButtonText="Add to Queue"
                />
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products in queue
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding products by clicking the "Add Another Product"
                button.
              </p>
              <Button onClick={handleAddAnother}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : null}

          {products.length > 0 && !showForm && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Products Queue ({products.length})
              </h2>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Features
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
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
                              <div className="text-sm text-gray-500">
                                {product.unit}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(index)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AddProducts
