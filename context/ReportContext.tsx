'use client';

import { useJwt } from "@/hooks";
import { CallData, transformRawData } from '@/lib/dataUtils';
import dayjs from 'dayjs';
import * as Papa from "papaparse";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

export type TimeRange = 'today' | 'mtd' | 'last7days';

interface ReportContextType {
  data: any[];
  loading: boolean;
  refreshData: (range?: TimeRange) => Promise<void>;
  clearData: () => void;
  cleaned: CallData[];
  minRate: number;
  usdMxnRate: number;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const CACHE_KEY = 'report_cache_data';
const CACHE_TIME_KEY = 'report_cache_time';
const MIN_RATE_KEY = 'min_usd_rate';
const USD_MXN_KEY = 'usd_mxn_rate';

// cache expires after 5 minutes (adjust if needed)
const CACHE_DURATION = 5 * 60 * 1000;

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const { jwt } = useJwt();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [minRate, setMinRate] = useState(0.75);
  const [usdMxnRate, setUsdMxnRate] = useState(17.8);

  // 🔹 Load rates from localStorage
  useEffect(() => {
    const storedMin = localStorage.getItem(MIN_RATE_KEY);
    const storedMxn = localStorage.getItem(USD_MXN_KEY);

    if (storedMin) setMinRate(parseFloat(storedMin));
    if (storedMxn) setUsdMxnRate(parseFloat(storedMxn));
  }, []);

  const updateData = (newData: any[]) => {
    setData(newData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  };

  const fetchToState = useCallback(async (range: TimeRange = 'mtd') => {
    if (!jwt) return;

    let start: number;
    let end: number = dayjs().unix();

    switch (range) {
      case 'today':
        start = dayjs().startOf('day').unix();
        end = dayjs().endOf('day').unix();
        break;
      case 'last7days':
        start = dayjs().subtract(7, 'day').startOf('day').unix();
        break;
      case 'mtd':
      default:
        start = dayjs().startOf('month').unix();
        break;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/report?startTime=${start}&endTime=${end}`, {
        headers: { Authorization: `JWT ${jwt}` },
      });

      if (!response.ok) return;

      const csvText = await response.text();

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      updateData(result.data);
    } catch (error) {
      console.error("Parsing error:", error);
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  // 🔥 Cache + stale-while-revalidate
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    const isExpired =
      !cachedTime || (Date.now() - Number(cachedTime)) > CACHE_DURATION;

    // 1. Show cached instantly
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // 2. Always refetch if expired OR no cache (background update)
    if (jwt && (!cached || isExpired)) {
      fetchToState('mtd');
    }

    // 3. Optional: even if NOT expired, still refresh in background
    if (jwt && cached && !isExpired) {
      fetchToState('mtd');
    }

  }, [jwt, fetchToState]);

  const clearData = () => {
    setData([]);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  };

  // ✅ Memoized transform (important)
  const cleaned = useMemo(() => {
    return transformRawData(data);
  }, [data]);

  return (
    <ReportContext.Provider
      value={{
        data,
        loading,
        refreshData: fetchToState,
        clearData,
        cleaned,
        minRate,
        usdMxnRate,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};