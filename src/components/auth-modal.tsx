"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { registerSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useFetchApi } from "@/hooks/use-fetch";

type FormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  const fetchApi = useFetchApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    if (activeTab === "signin") {
      delete data.name;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // TODO: implement toast notification
        alert("Invalid credentials");
        setIsLoading(false);
        return;
      }

      const resp = await res.json();
      setUser({ id: resp.user.id, role: resp.user.role });
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // TODO: implement toast notification
        alert("Could not Sign up. Please try again later");
        setIsLoading(false);
        return;
      }

      const resp = await res.json();
      setUser({ id: resp.user.id, role: resp.user.role });
    }
    setIsLoading(false);
    router.push("/buyers");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "signin" | "signup");
    clearErrors();
    reset();
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const res = await fetchApi("/api/auth/demo");

    if (!res) {
      setDemoLoading(false);
      alert("Could not login. Try again later.");
      return;
    }
    const resp = await res.json();
    setUser({ id: resp.user.id, role: resp.user.role });
    setDemoLoading(false);
    router.push("/buyers");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold">
            Welcome back
          </DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <TabsContent value="signin" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </TabsContent>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {activeTab === "signin"
                    ? "Signing in..."
                    : "Creating account..."}
                </div>
              ) : activeTab === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <Button type="button" className="w-full" onClick={handleDemoLogin}>
              {demoLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signin in...
                </div>
              ) : (
                <div>Demo Sign in</div>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            {activeTab === "signin" ? (
              <p>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setActiveTab("signin")}
                >
                  Sign in
                </Button>
              </p>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
