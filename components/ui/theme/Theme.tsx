'use client';

import { useThemeState } from "@/hooks";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

export default function Theme() {
    const { isDark, toggleTheme } = useThemeState();
    
    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                toggleTheme()
            }}
            type="button"
            aria-label="Toggle Theme"
            className="relative surface-2 rounded-full h-7 px-1 py-1 w-14 flex items-center cursor-pointer "
        >
            <div className={clsx(
                "size-6 p-1 flex items-center justify-center rounded-full bg-background transition-transform duration-200 ease-in-out pointer-events-none",
                isDark ? "translate-x-6 border border-border" : "translate-x-0"
            )}>
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
            </div>
        </button>
    );
}








