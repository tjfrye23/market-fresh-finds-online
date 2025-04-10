
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "./ProductForm";
import { Product } from "./types";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onResetForm: () => void;
}

const ProductDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingProduct, 
  onResetForm 
}: ProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onResetForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          editingProduct={editingProduct} 
          onSuccess={() => onOpenChange(false)} 
          onCancel={onResetForm} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
