"use client";

import BuyerForm from "@/components/buyer-form";
import { useUser } from "@/context/user-context";
import { useFetchApi } from "@/hooks/use-fetch";
import { FormData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewBuyerPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const fetchApi = useFetchApi();
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
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

  if (!user) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    const res = await fetchApi("/api/buyers", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res) {
      return;
    }

    router.push("/buyers");
  };
  return (
    <div>
      <BuyerForm onSubmit={onSubmit} />
    </div>
  );
}
