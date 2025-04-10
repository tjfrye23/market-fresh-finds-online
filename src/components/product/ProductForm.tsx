
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, UNITS, productFormSchema } from "./productConstants";
import { Product, ProductFormValues } from "./types";

interface ProductFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ editingProduct, onSuccess, onCancel }: ProductFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: editingProduct?.name || "",
      price: editingProduct ? editingProduct.price.toString() : "",
      unit: editingProduct?.unit || "",
      category: editingProduct?.category || "",
      description: editingProduct?.description || "",
      image: editingProduct?.image || "",
      organic: editingProduct?.organic || false,
      local: editingProduct?.local || false,
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const productData = {
        name: values.name,
        price: parseFloat(values.price),
        unit: values.unit,
        category: values.category,
        description: values.description || null,
        image: values.image || null,
        organic: values.organic,
        local: values.local,
        farmer_id: user?.id
      };

      let response;
      if (editingProduct) {
        response = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
      } else {
        response = await supabase
          .from("products")
          .insert([productData]);
      }

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerProducts"] });
      toast.success(editingProduct ? "Product updated" : "Product added");
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    addProductMutation.mutate(values);
  };

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    existingImageUrl={field.value || null}
                    onImageUploaded={(url) => field.onChange(url)}
                    onImageRemoved={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Organic Strawberries" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                      >
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Locally Sourced</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={addProductMutation.isPending}>
              {addProductMutation.isPending ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default ProductForm;
