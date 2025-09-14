import { Buyer } from "@prisma/client";

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
