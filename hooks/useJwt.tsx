"use client";
import { useCallback, useEffect, useState } from "react";

export default function useJwt() {
  // Initialize state (handling SSR safety)
  const [jwt, setJwt] = useState<string | null>(null);

  // Function to refresh state from localStorage
  const checkJwt = useCallback(() => {
    const token = localStorage.getItem("jwt");
    setJwt(token);
  }, []);

  useEffect(() => {
    // 1. Initial check on mount
    checkJwt();

    // 2. Listen for changes from OTHER tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jwt") setJwt(e.newValue);
    };

    // 3. Listen for changes in the SAME tab
    // We dispatch a custom event when we manually update localStorage
    const handleLocalUpdate = () => checkJwt();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("jwt-changed", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("jwt-changed", handleLocalUpdate);
    };
  }, [checkJwt]);

  return { 
    jwt, 
    isAuthenticated: !!jwt,
    // Use this helper to update JWT so the hook sees it immediately
    setToken: (token: string | null) => {
      if (token) {
        localStorage.setItem("jwt", token);
      } else {
        localStorage.removeItem("jwt");
      }
      window.dispatchEvent(new Event("jwt-changed"));
    }
  };
}
