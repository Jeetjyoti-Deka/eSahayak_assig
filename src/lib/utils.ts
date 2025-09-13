import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    MORE_THAN_SIX: "after 6 months",
    EXPLORING: "exploring",
  };
  return map[timeline];
}
