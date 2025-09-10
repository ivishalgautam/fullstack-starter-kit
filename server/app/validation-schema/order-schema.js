// schemas/orderSchema.js
import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(3, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(6).optional(),
});

export const orderItemSchema = z.object({
  item_type: z.enum(["book", "product"]),
  item_id: z.string().uuid({ message: "Invalid item_id" }),
  quantity: z.number().int().positive({ message: "Quantity must be > 0" }),
  // optional: allow client to pass extra info (edition, format, variant, etc.)
  //   metadata: z.record(z.any()).optional(),
});

export const createOrderSchema = z.object({
  shipping_address: addressSchema.optional(),
  billing_address: addressSchema.optional(),
  order_items: z
    .array(orderItemSchema)
    .min(1, "order_items must contain at least one item"),
  payment_method: z
    .enum(["card", "upi", "cod", "paypal", "bank_transfer"])
    .optional(),
  coupon_code: z.string().trim().optional(),
});
