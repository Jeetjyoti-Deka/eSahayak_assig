"use client";

import { LeadsTable } from "@/components/leads-table";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { useFetchApi } from "@/hooks/use-fetch";
import { Loader2, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BuyersPage = () => {
  const { userId, loading: userLoading, setUserId } = useUser();
  const router = useRouter();
  const fetchApi = useFetchApi();
  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      router.push("/");
      // TODO: implement toast notification
      alert("Please sign in to access this page.");
    }
  }, [userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  const handleLogout = async () => {
    setUserId(null);
    router.push("/");
    await fetchApi("/api/auth/logout", {
      method: "POST",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-start justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">
            Property Leads Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your property leads with advanced filtering and
            search capabilities.
          </p>
        </div>
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <UserMinus className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <LeadsTable />
    </div>
  );
};
export default BuyersPage;
