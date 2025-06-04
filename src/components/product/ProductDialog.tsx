
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

  const handleSuccess = (values: ProductFormValues) => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
