
"use client";

// 1. Imports
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

// 2. Types
import { ReportData } from "@/domains/dashboard/report.types";
import { normalizePrimaryData } from "@/domains/dashboard/report.utils";
import { useJwt } from "@/hooks";

type ReportContextType = {
    data: ReportData[];
    loading: boolean;
    refreshData: () => Promise<void>;
    clearData: () => void;
    minRate: number;
    usdMxnRate: number;
};

// 3. Constants
const PRIMARY_KEY = "primary";
const SECONDARY_KEY = "secondary";

// 4. Context
const ReportContext = createContext<ReportContextType | undefined>(
    undefined
);

// 5. Provider
type ReportProviderProps = {
    children: ReactNode;
};

export function ReportProvider({ children }: ReportProviderProps) {
    const { jwt } = useJwt();

    // STATE
    const [primary, setPrimary] = useState<ReportData[]>([]);
    const [secondary, setSecondary] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);

    // FUNCTION: Fetch primary data
    const fetchPrimary = useCallback(async (): Promise<ReportData[] | null> => {
        try {
            const now = new Date();

            const startOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1,
                0, 0, 0
            );

            const start = Math.floor(startOfMonth.getTime() / 1000);
            const end = Math.floor(now.getTime() / 1000);

            const response = await fetch(
                `/api/report?startTime=${start}&endTime=${end}`,
                {
                    headers: {
                        Authorization: `JWT ${jwt}`,
                    },
                }
            );

            if (!response.ok) {
                console.warn(
                    "Report request failed:",
                    response.status
                );
                return null;
            }

            // 1. Read CSV
            const csv = await response.text();

            // 2. Normalize CSV
            const data = normalizePrimaryData(csv);

            // 3. Return normalized data
            return data;

        } catch (error) {
            console.error("Failed to fetch primary report data:", error);
            return null;
        }
    }, [jwt]);

    // FUNCTION: Get cached primary data
    const getCachedPrimary = useCallback((): ReportData[] => {
        try {
            const cached = localStorage.getItem(PRIMARY_KEY);

            if (!cached) return [];

            const parsed = JSON.parse(cached);

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid primary cache format");
            }

            return parsed;

        } catch (error) {
            console.error("Failed to read primary cache:", error);

            // Remove corrupted cache
            localStorage.removeItem(PRIMARY_KEY);

            return [];
        }
    }, []);

    // FUNCTION: Get secondary data
    const getSecondary = useCallback((): ReportData[] => {
        try {
            const cached = localStorage.getItem(SECONDARY_KEY);

            if (!cached) return [];

            const parsed = JSON.parse(cached);

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid secondary cache format");
            }

            return parsed;

        } catch (error) {
            console.error("Failed to read secondary cache:", error);

            // Remove corrupted cache
            localStorage.removeItem(SECONDARY_KEY);

            return [];
        }
    }, []);

    // FUNCTION: Combine datasets
    const combineData = useCallback((
        primaryData: ReportData[],
        secondaryData: ReportData[]
    ): ReportData[] => {

        const parseTimeToMinutes = (timeStr?: string): number => {
            if (!timeStr) return 0;
            const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|A|P)?$/i);
            if (!match) return 0;

            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3]?.toUpperCase();

            if (period?.startsWith('P') && hours < 12) hours += 12;
            if (period?.startsWith('A') && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        const parseDateMs = (dateStr: string): number => {
            const [month, day, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day).getTime();
        };

        return [...primaryData, ...secondaryData].sort((a, b) => {
            const dateDiff = parseDateMs(a.date) - parseDateMs(b.date);
            if (dateDiff !== 0) return dateDiff;

            return parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start);
        });

    }, []);

    // FUNCTION: Refresh data
    const refreshData = useCallback(async (): Promise<void> => {
        setLoading(true);

        try {
            // 1. Try fetching fresh primary data
            const freshPrimary = await fetchPrimary();

            // 2. Use fresh data or fallback to cache
            const primaryData = freshPrimary ?? getCachedPrimary();

            // 3. Read secondary data
            const secondaryData = getSecondary();

            // 4. Update state
            setPrimary(primaryData);
            setSecondary(secondaryData);

        } catch (error) {
            console.error("Failed to refresh report data:", error);

            // Fallback to cached data
            setPrimary(getCachedPrimary());
            setSecondary(getSecondary());

        } finally {
            setLoading(false);
        }

    }, [fetchPrimary, getCachedPrimary, getSecondary]);

    // FUNCTION: Clear data
    const clearData = useCallback((): void => {

        // Clear primary cache
        localStorage.removeItem(PRIMARY_KEY);

        // Clear primary state
        setPrimary([]);

        // Preserve secondary data

    }, []);

    // DERIVED DATA
    const data = useMemo(() => {
        const combined = combineData(primary, secondary)
        return combined;
    }, [primary, secondary, combineData]);

    // INITIAL LOAD
    useEffect(() => {
        void refreshData();
    }, [refreshData]);

    // PROVIDER VALUE
    const value = useMemo(() => ({
        data,
        loading,
        refreshData,
        clearData,
        minRate: 0.75,
        usdMxnRate: 18.5
    }), [data, loading, refreshData, clearData]);

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
}

// 6. Consumer hook
export function useReport(): ReportContextType {
    const context = useContext(ReportContext);

    if (!context) {
        throw new Error(
            "useReport must be used within a ReportProvider"
        );
    }

    return context;
}
