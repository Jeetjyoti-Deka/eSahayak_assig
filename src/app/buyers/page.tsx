"use client";

import { LeadsTable } from "@/components/leads-table";
import { useUser } from "@/context/user-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BuyersPage = () => {
  const { userId } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!userId) {
      router.push("/");
      // TODO: implement toast notification
      alert("Please sign in to access this page.");
    }
  }, [userId, router]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">
          Property Leads Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your property leads with advanced filtering and
          search capabilities.
        </p>
      </div>
      <LeadsTable />
    </div>
  );
};
export default BuyersPage;
