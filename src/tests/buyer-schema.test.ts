import { createBuyerSchema } from "@/lib/validations";
import { describe, it, expect } from "vitest";

describe("createBuyerSchema", () => {
  it("should fail if BHK is missing for Apartment", () => {
    const result = createBuyerSchema.safeParse({
      fullName: "Test",
      email: "test@email.com",
      phone: "1234567890",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: null,
      purpose: "Buy",
      budgetMin: 1000,
      budgetMax: 2000,
      timeline: "ZERO_TO_THREE",
      source: "Website",
      notes: "",
      tags: [],
      status: "New",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "BHK is required for Apartment/Villa"
      );
    }
  });

  it("should pass if BHK is present for Apartment", () => {
    const result = createBuyerSchema.safeParse({
      fullName: "Test",
      email: "test@email.com",
      phone: "1234567890",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: "TWO",
      purpose: "Buy",
      budgetMin: 1000,
      budgetMax: 2000,
      timeline: "ZERO_TO_THREE",
      source: "Website",
      notes: "",
      tags: [],
      status: "New",
    });

    expect(result.success).toBe(true);
  });

  it("should fail if budgetMax is less than budgetMin", () => {
    const result = createBuyerSchema.safeParse({
      fullName: "Test",
      email: "test@email.com",
      phone: "1234567890",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: "TWO",
      purpose: "Buy",
      budgetMin: 2000,
      budgetMax: 1000,
      timeline: "ZERO_TO_THREE",
      source: "Website",
      notes: "",
      tags: [],
      status: "New",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "budgetMax must be ≥ budgetMin"
      );
    }
  });
});
