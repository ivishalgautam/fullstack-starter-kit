import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce
    .number({ message: "Enter valid price." })
    .min(1, { message: "Price required." }),
  description: z.string().optional(),
  related_books: z.array(z.string().uuid()).default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
});
