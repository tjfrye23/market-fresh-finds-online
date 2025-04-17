import { z } from 'zod'

export const CATEGORIES = [
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'dairy-eggs', label: 'Dairy & Eggs' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'meat', label: 'Meat' },
  { value: 'prepared-foods', label: 'Prepared Foods' },
]

export const UNITS = [
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'oz', label: 'Ounce (oz)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'each', label: 'Each' },
  { value: 'bunch', label: 'Bunch' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pint', label: 'Pint' },
  { value: 'quart', label: 'Quart' },
  { value: 'gallon', label: 'Gallon' },
  { value: 'package', label: 'Package' },
  { value: 'box', label: 'Box' },
]

export const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a positive number',
    }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  description: z.string().optional(),
  image: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  organic: z.boolean().default(false),
  local: z.boolean().default(false),
})
