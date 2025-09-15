"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

interface ValidationError {
  row: number;
  message: string;
}

interface ValidationErrorsTableProps {
  errors: ValidationError[];
}

export function ValidationErrorsTable({ errors }: ValidationErrorsTableProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Row #</TableHead>
              <TableHead>Error Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {error.row === 0 ? "File" : error.row}
                  </div>
                </TableCell>
                <TableCell className="text-red-700">{error.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {errors.length > 10 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing first {Math.min(errors.length, 100)} errors.
          {errors.length > 100 &&
            ` ${errors.length - 100} more errors not shown.`}
        </div>
      )}
    </div>
  );
}
