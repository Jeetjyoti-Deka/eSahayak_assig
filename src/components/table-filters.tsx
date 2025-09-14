"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { TableFilters as Filters } from "@/lib/types";
import {
  cityLabels,
  propertyTypeLabels,
  statusLabels,
  timelineLabels,
} from "@/lib/mappings";

interface TableFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  // TODO: more strict types
  filterOptions: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
}

export function TableFilters({
  filters,
  onFiltersChange,
  onReset,
  filterOptions,
}: TableFiltersProps) {
  const hasActiveFilters = !!(
    filters.city ||
    filters.propertyType ||
    filters.status ||
    filters.timeline
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={filters.city || "allCities"}
              onValueChange={(value) =>
                onFiltersChange({
                  city:
                    value === "allCities"
                      ? undefined
                      : (value as Filters["city"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allCities">All cities</SelectItem>
                {filterOptions.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {cityLabels[city as keyof typeof cityLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={filters.propertyType || "allTypes"}
              onValueChange={(value) =>
                onFiltersChange({
                  propertyType:
                    value === "allTypes"
                      ? undefined
                      : (value as Filters["propertyType"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allTypes">All types</SelectItem>
                {filterOptions.propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {
                      propertyTypeLabels[
                        type as keyof typeof propertyTypeLabels
                      ]
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || "allStatuses"}
              onValueChange={(value) =>
                onFiltersChange({
                  status:
                    value === "allStatuses"
                      ? undefined
                      : (value as Filters["status"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allStatuses">All statuses</SelectItem>
                {filterOptions.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status as keyof typeof statusLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Select
              value={filters.timeline || "allTimelines"}
              onValueChange={(value) =>
                onFiltersChange({
                  timeline:
                    value === "allTimelines"
                      ? undefined
                      : (value as Filters["timeline"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All timelines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allTimelines">All timelines</SelectItem>
                {filterOptions.timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timelineLabels[timeline as keyof typeof timelineLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
