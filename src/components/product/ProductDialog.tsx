import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import ProductForm from './ProductForm'
import { Product, ProductFormValues } from './types'

interface ProductDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingProduct: Product | null
  onResetForm: () => void
}

const ProductDialog = ({
  isOpen,
  onOpenChange,
  editingProduct,
  onResetForm,
}: ProductDialogProps) => {
  const navigate = useNavigate()

  const handleAddNewClick = () => {
    onResetForm()
    navigate('/add-products')
  }

  const handleSuccess = (values: ProductFormValues) => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Products
        </Button>
      </DialogTrigger>
      {editingProduct && (
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            editingProduct={editingProduct}
            onSuccess={handleSuccess}
            onCancel={onResetForm}
          />
        </DialogContent>
      )}
    </Dialog>
  )
}

export default ProductDialog
