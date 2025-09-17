"use client";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useFetchApi() {
  const router = useRouter();
  const { setUser } = useUser();

  async function fetchApi(url: string, options?: RequestInit) {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        toast.warning("Please sign in to continue.");
        router.push("/");
        setUser(null);
        return null;
      }

      if (response.status === 400) {
        toast.error("Invalid input");
        return null;
      }

      if (response.status === 403) {
        toast.error("you are not authorized for this action.");
        return null;
      }

      if (response.status === 409) {
        toast.info("Record changed, please refresh to get the latest data.");
        return null;
      }

      if (response.status === 429) {
        toast.error("Too many requests, please try again later.");
        return null;
      }

      toast.error("Something went wrong. Try again later.");
      router.push("/buyers");
      return null;
    }

    return response;
  }

  return fetchApi;
}
