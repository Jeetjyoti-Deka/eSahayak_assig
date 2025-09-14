"use client";

import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Our App
          </h1>
          <p className="text-xl text-muted-foreground">
            Get started by signing in or creating an account
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => setIsAuthModalOpen(true)}
          className="px-8"
        >
          Get Started
        </Button>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </main>
  );
}
