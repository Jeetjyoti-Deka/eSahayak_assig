"use client";

import BuyerForm from "@/components/buyer-form";
import { BuyerHistory } from "@/components/buyer-history";
import { BuyerInfo } from "@/components/buyer-info";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { BuyerData, FormData, HistoryEntry } from "@/lib/types";
import { ArrowLeft, Edit, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import React from "react";

export default function BuyerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [buyer, setBuyer] = useState<BuyerData | undefined>(undefined);
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = React.use(params);
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

  useEffect(() => {
    setLoading(true);
    const fetchBuyer = async () => {
      const response = await fetch(`/api/buyers/${id}`);
      const data = await response.json();
      setBuyer(data);
      setHistory(data.history);
      setLoading(false);
    };
    fetchBuyer();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch(`/api/buyers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const resp = await res.json();

    setHistory(resp.history);
    delete resp.history;
    setBuyer(resp);

    if (res.ok) {
      router.refresh();
      setIsEdit(false);
    } else {
      const err = await res.json();
      alert(err.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!buyer || !history) {
    return <div>Buyer not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/buyers">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Buyers
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {buyer.fullName}
                </h1>
                <p className="text-muted-foreground">Buyer ID: {buyer.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEdit ? (
                <Button
                  size="sm"
                  className="bg-popover-foreground hover:bg-popover-foreground/90"
                  onClick={() => setIsEdit(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90"
                  onClick={() => setIsEdit(true)}
                  disabled={buyer.ownerId !== userId}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Buyer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEdit ? (
          <div>
            <BuyerForm defaultValues={buyer} onSubmit={onSubmit} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Buyer Information - Takes 2 columns */}
            <div className="lg:col-span-2">
              <BuyerInfo buyer={buyer} />
            </div>

            {/* Buyer History - Takes 1 column */}
            <div className="lg:col-span-1">
              <BuyerHistory history={history} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
