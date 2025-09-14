"use client";

import BuyerForm from "@/components/buyer-form";
import { FormData } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function NewBuyerPage() {
  const router = useRouter();
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
