
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, UNITS, productFormSchema } from './productConstants'
import { Product, ProductFormValues } from './types'
import { saveProduct } from '@/services/mockServices'
import { useAuth } from '@/contexts/AuthContext'
import ImageUploader from '@/components/ImageUploader'

interface ProductFormProps {
  editingProduct: Product | null
  initialValues?: ProductFormValues
  onSuccess: (values: ProductFormValues) => void
  onCancel: () => void
  submitButtonText?: string
}

const ProductForm = ({
  editingProduct,
  initialValues,
  onSuccess,
  onCancel,
  submitButtonText = 'Save Product',
}: ProductFormProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues || {
      name: editingProduct?.name || '',
      price: editingProduct?.price?.toString() || '',
      unit: editingProduct?.unit || '',
      category: editingProduct?.category || '',
      description: editingProduct?.description || '',
      image: editingProduct?.image || '',
      organic: editingProduct?.organic || false,
      local: editingProduct?.local || false,
      stock: editingProduct?.stock?.toString() || '10',
    },
  })

  const saveProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const productData = {
        ...values,
        price: parseFloat(values.price),
        stock: editingProduct ? parseInt(values.stock) : 10, // Default stock for new products
        image: uploadedImage || values.image,
        id: editingProduct?.id,
      }

      return await saveProduct(productData, user?.id || '')
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] })
      
      if (editingProduct) {
        toast.success('Product updated successfully')
      } else {
        onSuccess(variables)
      }
    },
    onError: (error) => {
      console.error('Error saving product:', error)
      toast.error(`Error: ${error.message}`)
    },
  })

  const onSubmit = (values: ProductFormValues) => {
    saveProductMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Organic Tomatoes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {editingProduct && (
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Product Image (Optional)</FormLabel>
          <ImageUploader
            existingImageUrl={editingProduct?.image || null}
            onImageUploaded={setUploadedImage}
            onImageRemoved={() => setUploadedImage(null)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="organic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Organic</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="local"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Local</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saveProductMutation.isPending}
          >
            {saveProductMutation.isPending ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
