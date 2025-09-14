"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BuyerData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { timelineLabels } from "@/lib/mappings";

interface DataTableProps {
  data: BuyerData[];
  onSort: (column: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const statusColors = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Qualified:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Contacted:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Visited:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Negotiation: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  Converted:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  Dropped: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function DataTable({ data, onSort, sortBy, sortOrder }: DataTableProps) {
  const router = useRouter();

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          {children}
          {getSortIcon(column)}
        </div>
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader column="fullName">Name</SortableHeader>
            <SortableHeader column="phone">Phone</SortableHeader>
            <SortableHeader column="city">City</SortableHeader>
            <SortableHeader column="propertyType">Property Type</SortableHeader>
            <SortableHeader column="budgetMin">Budget</SortableHeader>
            <SortableHeader column="timeline">Timeline</SortableHeader>
            <SortableHeader column="status">Status</SortableHeader>
            <SortableHeader column="updatedAt">Updated At</SortableHeader>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{lead.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>{lead.propertyType}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {lead.budgetMin && (
                      <div>{formatCurrency(lead.budgetMin)}</div>
                    )}
                    {lead.budgetMax && (
                      <div className="text-muted-foreground">
                        to {formatCurrency(lead.budgetMax)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{timelineLabels[lead.timeline]}</TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[lead.status]}
                    variant="secondary"
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(lead.updatedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        router.push(`/buyers/${lead.id}`);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View lead</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        router.push(`/buyers/${lead.id}?edit=true`);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit lead</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
