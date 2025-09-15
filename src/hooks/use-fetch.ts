"use client";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

export function useFetchApi() {
  const router = useRouter();
  const { setUserId } = useUser();

  async function fetchApi(url: string, options?: RequestInit) {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        alert("Please sign in to access this page.");
        router.push("/");
        setUserId(null);
        return null;
      }

      if (response.status === 400) {
        // TODO: toast notification
        alert("Invalid input");
        return null;
      }

      alert("Something went wrong. Try again later.");
      router.push("/buyers");
      return null;
    }

    return response;
  }

  return fetchApi;
}
