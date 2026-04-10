"use client";
import { useCallback, useEffect, useState } from "react";

export default function useThemeState() {
  const [isDark, setIsDark] = useState(false);

  // 1. Load theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // 2. Toggle theme
  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = !isDark;

    if (next) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }, [isDark]);

  return { isDark, toggleTheme };
}