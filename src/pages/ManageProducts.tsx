import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProductList from '@/components/product/ProductList'
import ProductDialog from '@/components/product/ProductDialog'
import { Product } from '@/components/product/types'
import { useVendorProducts } from '@/hooks/useVendorProducts'

const ManageProducts = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useVendorProducts(user.id)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageHeader
          title="Manage Your Shop"
          description="Add and manage your products for the marketplace"
          image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        />

        <div className="page-container py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Shop</h2>

            <ProductDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              editingProduct={editingProduct}
              onResetForm={resetForm}
            />
          </div>

          <ProductList
            products={products}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ManageProducts
