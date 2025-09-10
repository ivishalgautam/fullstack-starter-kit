// /frontend/schemas/product.ts
import { z } from "zod";

export const ProductFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce
    .number({ message: "Enter valid price." })
    .min(1, { message: "Price required." }),
  // pictures: z.array(z.any()).default([]),
  description: z.string().optional(),
  min_age: z.number().int().nonnegative(),
  features: z
    .array(
      z.object({
        image: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .default([]),
  youtube_urls: z
    .array(z.object({ url: z.string().url().optional() }))
    .transform((data) => data.map((d) => d.url))
    .default([]),
  specifications: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Required*" }),
        description: z.string().min(1, { message: "Required*" }),
      }),
    )
    .default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
});
