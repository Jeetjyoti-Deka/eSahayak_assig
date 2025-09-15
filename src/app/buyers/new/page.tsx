"use client";

import BuyerForm from "@/components/buyer-form";
import { useUser } from "@/context/user-context";
import { FormData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewBuyerPage() {
  const router = useRouter();
  const { userId } = useUser();
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
  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/buyers", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/buyers");
    } else {
      const err = await res.json();
      // TODO: implement toast notification
      alert(err.error);
    }
  };
  return (
    <div>
      <BuyerForm onSubmit={onSubmit} />
    </div>
  );
}
