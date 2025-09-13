import { z } from "zod";

export const createBuyerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { error: "Name is required" })
      .min(2, { error: "Name should have at least 2 characters" }),
    email: z.preprocess(
      (val) => (val === "" ? undefined : val), // convert empty string to undefined
      z.email({ error: "Please enter a valid email address" }).optional()
    ),
    phone: z.preprocess(
      (val) => (val === "" ? undefined : val), // convert empty string to undefined
      z
        .string({ error: "Phone number is required" })
        .regex(/^\d{10,15}$/, { error: "Please enter a valid phone number" })
    ),
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"], {
      error: "Please select a city",
    }),
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"], {
      error: "Please select a property type",
    }),
    bhk: z
      .enum(["STUDIO", "ONE", "TWO", "THREE", "FOUR"], {
        error: "Please select a BHK",
      })
      .optional(),
    purpose: z.enum(["Buy", "Rent"]),
    budgetMin: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return Number(val);
    }, z.number().optional()),

    budgetMax: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return Number(val);
    }, z.number().optional()),
    timeline: z.enum(
      ["ZERO_TO_THREE", "THREE_TO_SIX", "GREATER_THAN_6", "Exploring"],
      {
        error: "Please select a timeline",
      }
    ),
    source: z.enum(["Website", "Referral", "Walk-in", "Call", "Other"], {
      error: "Please select a source",
    }),
    notes: z.string().max(1000).optional(),
    tags: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      ["Apartment", "Villa"].includes(data.propertyType) &&
      data.bhk == null
    ) {
      ctx.addIssue({
        path: ["bhk"],
        code: "custom",
        message: "BHK is required for Apartment/Villa",
      });
    }

    if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        path: ["budgetMax"],
        code: "custom",
        message: "budgetMax must be ≥ budgetMin",
      });
    }
  });
