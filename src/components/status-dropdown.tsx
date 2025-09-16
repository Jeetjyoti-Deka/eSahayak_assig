"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
// import { updateLeadStatus } from "@/lib/actions"
import type { BuyerData } from "@/lib/types";
import { statusColors, statusLabels } from "@/lib/mappings";
import { useFetchApi } from "@/hooks/use-fetch";

interface StatusDropdownProps {
  lead: BuyerData;
  isInert: boolean;
}

const allStatuses: BuyerData["status"][] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Dropped",
  "Negotiation",
  "Visited",
];

export function StatusDropdown({ lead, isInert }: StatusDropdownProps) {
  const [currentStatus, setCurrentStatus] = useState(lead.status);
  const fetchApi = useFetchApi();

  const handleStatusChange = async (newStatus: BuyerData["status"]) => {
    if (newStatus === currentStatus) return;

    const oldStatus = currentStatus;
    setCurrentStatus(newStatus);
    //   await updateLeadStatus(lead.id, newStatus);
    const res = await fetchApi(`/api/buyers/${lead.id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus, updatedAt: lead.updatedAt }),
    });

    if (!res) {
      // You could add a toast notification here
      setCurrentStatus(oldStatus);
      return;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger inert={isInert} asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 hover:bg-transparent group cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Badge className={statusColors[currentStatus]} variant="secondary">
              {statusLabels[currentStatus]}
            </Badge>
            {!isInert && (
              <ChevronDown className="h-3 w-3 text-black group-hover:text-black/70" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {allStatuses.map((status) => (
          <DropdownMenuItem
            variant="destructive"
            key={status}
            onClick={() => handleStatusChange(status)}
            className="cursor-pointer"
          >
            <Badge className={statusColors[status]} variant="secondary">
              {statusLabels[status]}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
