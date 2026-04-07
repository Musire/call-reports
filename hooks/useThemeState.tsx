"use client";
import { useState, useEffect, useCallback } from "react";

export default function useThemeState() {
  const [isDark, setIsDark] = useState(false);

  // 1. The Toggle Function (Updates the DOM directly)
  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const isNowDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
  }, []);

  // 2. The Observer (Syncs React state to the DOM)
  useEffect(() => {
    const root = document.documentElement;
    
    // Initial sync on mount
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    return () => observer.disconnect();
  }, []);

  return { isDark, toggleTheme };
}
