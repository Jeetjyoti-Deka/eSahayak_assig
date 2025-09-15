import { z } from "zod";

export const createBuyerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { error: "Name is required" })
      .min(2, { error: "Name should have at least 2 characters" }),
    email: z.preprocess(
      (val) => (val === "" ? null : val), // convert empty string to undefined
      z.email({ error: "Please enter a valid email address" }).nullable()
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
      .nullable()
      .optional(),
    purpose: z.enum(["Buy", "Rent"], {
      error: "Please select a purpose",
    }),
    budgetMin: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return Number(val);
    }, z.number().optional().nullable()),

    budgetMax: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return Number(val);
    }, z.number().optional().nullable()),
    timeline: z.enum(
      ["ZERO_TO_THREE", "THREE_TO_SIX", "GREATER_THAN_6", "Exploring"],
      {
        error: "Please select a timeline",
      }
    ),
    source: z.enum(["Website", "Referral", "Walk_in", "Call", "Other"], {
      error: "Please select a source",
    }),
    notes: z.string().max(1000).optional().nullable(),
    tags: z
      .preprocess((val) => {
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return val;
      }, z.array(z.string()))
      .optional(),
    status: z
      .enum(
        [
          "New",
          "Qualified",
          "Contacted",
          "Visited",
          "Negotiation",
          "Converted",
          "Dropped",
        ],
        { error: "Please select a status" }
      )
      .optional(),
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

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({ email: z.email(), password: z.string() });
