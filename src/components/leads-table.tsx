"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { TableFilters } from "./table-filters";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";
import { useTableParams } from "@/hooks/use-table-params";
// import { getLeads, getFilterOptions } from "@/lib/actions"
import type { BuyerData, PaginatedResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { exportBuyersToCSV } from "@/lib/utils";

export function LeadsTable() {
  const { filters, updateParams, resetFilters } = useTableParams();

  const [data, setData] = useState<PaginatedResponse<BuyerData> | null>(null);
  const [loading, setLoading] = useState(true);
  //   const [filterOptions, setFilterOptions] = useState({
  //     cities: [],
  //     propertyTypes: [],
  //     statuses: [],
  //     timelines: [],
  //   })
  const filterOptions = {
    cities: ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"],
    propertyTypes: ["Apartment", "Villa", "Plot", "Office", "Retail"],
    statuses: [
      "New",
      "Qualified",
      "Contacted",
      "Visited",
      "Negotiation",
      "Converted",
      "Dropped",
    ],
    timelines: ["ZERO_TO_THREE", "THREE_TO_SIX", "GREATER_THAN_6", "Exploring"],
  };

  // Load data when filters change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(
          Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) => value != null && value !== ""
            )
          )
        ).toString();

        const result = await fetch(`/api/buyers?${query}`).then((res) =>
          res.json()
        );
        setData(result);
      } catch (error) {
        console.error("Failed to load leads:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleSort = (column: string) => {
    const newSortOrder =
      filters.sortBy === column && filters.sortOrder === "desc"
        ? "asc"
        : "desc";
    updateParams({ sortBy: column, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    updateParams(newFilters);
  };

  const handleSearchChange = (search: string) => {
    updateParams({ search: search || undefined });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchInput
            value={filters.search || ""}
            onValueChange={handleSearchChange}
            placeholder="Search by name, phone, or email..."
          />
        </CardContent>
      </Card>

      {/* Filters */}
      <TableFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={resetFilters}
        filterOptions={filterOptions}
      />

      {/* Results Summary */}
      {data && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {data.total === 0 ? (
              "No leads found"
            ) : (
              <>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  `Showing ${(data.page - 1) * data.pageSize + 1} to
                ${Math.min(data.page * data.pageSize, data.total)} of
                ${data.total} leads`
                )}
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportBuyersToCSV(data.data)}
            className="flex items-center gap-2 bg-transparent"
            disabled={loading || data.total === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      )}

      {/* Data Table */}
      {data && (
        <DataTable
          data={data.data}
          onSort={handleSort}
          sortBy={filters.sortBy || "updatedAt"}
          sortOrder={filters.sortOrder || "desc"}
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          totalItems={data.total}
          pageSize={data.pageSize}
        />
      )}
    </div>
  );
}
