import { Buyer } from "@prisma/client";
import { createBuyerSchema } from "./validations";
import { z } from "zod";

export type BuyerData = Buyer;

export interface TableFilters {
  city?: BuyerData["city"];
  propertyType?: BuyerData["propertyType"];
  status?: BuyerData["status"];
  timeline?: BuyerData["timeline"];
  search?: string;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HistoryEntry {
  id: string;
  buyerId: string;
  changedBy: string;
  changedByUser: {
    name?: string;
    email: string;
    role: "ADMIN" | "USER";
  };
  changedAt: Date;
  diff:
    | {
        action: "CREATE";
        newValues: Record<string, any>;
      }
    | {
        action: "UPDATE";
        fields: Record<
          string,
          {
            from: any;
            to: any;
          }
        >;
      };
}

export type FormData = z.infer<typeof createBuyerSchema>;
