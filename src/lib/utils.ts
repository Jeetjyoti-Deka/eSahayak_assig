import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "json2csv";
import { Buyer } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapBhkEnumToValue(bhk: string | null) {
  if (!bhk) return null;
  const map: Record<string, string> = {
    STUDIO: "STUDIO",
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
  };
  return map[bhk];
}

export function mapTimelineEnumToValue(timeline: string | null) {
  if (!timeline) return null;
  const map: Record<string, string> = {
    ZERO_TO_THREE: "within 3 months",
    THREE_TO_SIX: "within 3-6 months",
    GREATER_THAN_6: "after 6 months",
    EXPLORING: "exploring",
  };
  return map[timeline];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getFilterOptions() {
  const cities = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
  const propertyTypes = ["Apartment", "Villa", "Plot", "Office", "Retail"];
  const statuses = [
    "New",
    "Qualified",
    "Contacted",
    "Visited",
    "Negotiation",
    "Converted",
    "Dropped",
  ];
  const timelines = [
    "ZERO_TO_THREE",
    "THREE_TO_SIX",
    "GREATER_THAN_6",
    "Exploring",
  ];

  return {
    cities,
    propertyTypes,
    statuses,
    timelines,
  };
}

export function exportBuyersToCSV(buyers: Buyer[]) {
  try {
    const fields = [
      "fullName",
      "email",
      "phone",
      "city",
      "propertyType",
      "bhk",
      "purpose",
      "budgetMin",
      "budgetMax",
      "timeline",
      "source",
      "notes",
      "tags",
      "status",
    ];

    // ✅ Convert to CSV
    const csv = parse(buyers, { fields });

    // ✅ Trigger file download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "buyers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error exporting CSV:", err);
  }
}
