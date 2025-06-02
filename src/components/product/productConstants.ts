
import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.string().min(1, 'Price is required'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  organic: z.boolean().default(false),
  local: z.boolean().default(false),
  stock: z.string().min(1, 'Stock quantity is required'),
})

export const CATEGORIES = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'meat', label: 'Meat' },
  { value: 'grains', label: 'Grains' },
  { value: 'other', label: 'Other' },
]

export const UNITS = [
  { value: 'lb', label: 'per pound' },
  { value: 'kg', label: 'per kilogram' },
  { value: 'bunch', label: 'per bunch' },
  { value: 'piece', label: 'per piece' },
  { value: 'bag', label: 'per bag' },
  { value: 'box', label: 'per box' },
  { value: 'dozen', label: 'per dozen' },
  { value: 'pint', label: 'per pint' },
  { value: 'quart', label: 'per quart' },
  { value: 'gallon', label: 'per gallon' },
]
