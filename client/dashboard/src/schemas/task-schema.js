import { z } from "zod";

export const taskSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(2, "Title must be at least 2 characters"),

    description: z.string().optional(),

    category_id: z
      .number({
        required_error: "Category ID required",
        invalid_type_error: "Category ID must be a number",
      })
      .positive("Invalid category"),

    due_date: z
      .string()
      .optional()
      .refine((v) => !v || !isNaN(Date.parse(v)), "Invalid date format"),

    priority: z.enum(["Low", "Medium", "High"]).default("Medium"),

    assigned_to: z
      .string()
      .uuid("Assigned user must be a valid UUID")
      .optional()
      .or(z.literal("").transform(() => undefined)), // allow empty

    project_id: z
      .string()
      .uuid("Project must be a valid UUID")
      .optional()
      .or(z.literal("").transform(() => undefined)),

    status: z
      .enum(["Pending", "In Progress", "Completed", "Cancelled", "Delayed"])
      .default("Pending"),

    is_repeated: z.boolean().default(false),

    frequency: z
      .enum(["Once", "Daily", "Weekly", "Monthly", "Yearly"])
      .default("Once"),

    weekly_repeat_days: z.array(z.string()).default([]),

    monthly_repeat_days: z.array(z.string()).default([]),

    end_date: z
      .string()
      .optional()
      .refine((v) => !v || !isNaN(Date.parse(v)), "Invalid end date"),
  })
  .superRefine((data, ctx) => {
    // If repeating task, end_date is mandatory
    if (data.is_repeated && !data.end_date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date is required for repeated tasks",
      });
    }

    // Weekly tasks: weekly_repeat_days must not be empty
    if (
      data.is_repeated &&
      data.frequency === "Weekly" &&
      (!data.weekly_repeat_days.length || data.weekly_repeat_days.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["weekly_repeat_days"],
        message: "Select at least one day for weekly repeat",
      });
    }

    // Monthly tasks: must have at least 1 valid day number
    if (data.is_repeated && data.frequency === "Monthly") {
      if (!data.monthly_repeat_days.length) {
        ctx.addIssue({
          code: "custom",
          path: ["monthly_repeat_days"],
          message: "Add at least one day of month",
        });
      }

      // Validate values are numbers 1-31
      const invalid = data.monthly_repeat_days.some(
        (d) => isNaN(Number(d)) || Number(d) < 1 || Number(d) > 31,
      );
      if (invalid) {
        ctx.addIssue({
          code: "custom",
          path: ["monthly_repeat_days"],
          message: "Days must be valid calendar dates (1-31)",
        });
      }
    }
  });
