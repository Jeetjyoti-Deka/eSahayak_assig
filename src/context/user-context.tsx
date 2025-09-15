"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext<{
  userId: string | null;
  setUserId: (id: string | null) => void;
  loading: boolean;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId);
          localStorage.setItem("userId", data.userId);
        } else {
          setUserId(null);
          localStorage.removeItem("userId");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
