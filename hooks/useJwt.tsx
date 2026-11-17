
"use client";

import { useCallback, useEffect, useState } from "react";

export default function useJwt() {
    // Initialize directly from localStorage (SSR safe)
    const [jwt, setJwt] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;

        return localStorage.getItem("jwt");
    });

    // Refresh state from localStorage
    const checkJwt = useCallback(() => {
        const token = localStorage.getItem("jwt");
        setJwt(token);
    }, []);

    useEffect(() => {
        // Listen for changes from OTHER tabs/windows
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "jwt") {
                setJwt(e.newValue);
            }
        };

        // Listen for changes in the SAME tab
        const handleLocalUpdate = () => checkJwt();

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("jwt-changed", handleLocalUpdate);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("jwt-changed", handleLocalUpdate);
        };
    }, [checkJwt]);

    // Update JWT
    const setToken = useCallback((token: string | null) => {
        if (token) {
            localStorage.setItem("jwt", token);
        } else {
            localStorage.removeItem("jwt");
        }

        setJwt(token);

        window.dispatchEvent(new Event("jwt-changed"));
    }, []);

    return {
        jwt,
        isAuthenticated: !!jwt,
        setToken
    };
}
