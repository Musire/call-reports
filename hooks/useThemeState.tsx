
"use client";

import { useCallback, useState } from "react";

export default function useThemeState() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;

        return localStorage.getItem("theme") === "dark";
    });

    // Toggle theme
    const toggleTheme = useCallback(() => {
        const next = !isDark;
        const root = document.documentElement;

        if (next) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", next ? "dark" : "light");
        setIsDark(next);
    }, [isDark]);

    return {
        isDark,
        toggleTheme
    };
}
