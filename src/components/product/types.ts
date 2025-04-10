
import { z } from "zod";
import { productFormSchema } from "./productConstants";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string | null;
  description: string | null;
  organic: boolean | null;
  local: boolean | null;
  category: string;
  farmer_id: string;
  created_at: string;
  updated_at: string;
}

export type ProductFormValues = z.infer<typeof productFormSchema>;
