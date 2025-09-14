"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { BuyerData, TableFilters } from "@/lib/types";

export function useTableParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: TableFilters = useMemo(() => {
    return {
      city: (searchParams.get("city") as TableFilters["city"]) || undefined,
      propertyType:
        (searchParams.get("propertyType") as TableFilters["propertyType"]) ||
        undefined,
      status:
        (searchParams.get("status") as TableFilters["status"]) || undefined,
      timeline:
        (searchParams.get("timeline") as TableFilters["timeline"]) || undefined,
      search: searchParams.get("search") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      sortBy: searchParams.get("sortBy") || "updatedAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (newFilters: Partial<TableFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      // Reset to page 1 when filters change (except when explicitly setting page)
      if (
        !("page" in newFilters) &&
        Object.keys(newFilters).some((key) => key !== "page")
      ) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    filters,
    updateParams,
    resetFilters,
  };
}
