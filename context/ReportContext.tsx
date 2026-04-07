'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Papa from "papaparse";
import dayjs from 'dayjs';
import { useJwt } from "@/hooks";

export type TimeRange = 'today' | 'mtd' | 'last7days';

interface ReportContextType {
  data: any[];
  loading: boolean;
  refreshData: (range?: TimeRange) => Promise<void>;
  clearData: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const CACHE_KEY = 'report_cache_data';

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const { jwt } = useJwt();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  console.log("data:", data)

  // Helper to update both React state and Browser cache
  const updateData = (newData: any[]) => {
    setData(newData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
  };

  const fetchToState = useCallback(async (range: TimeRange = 'mtd') => {
    if (!jwt) return;

    let start: number;
    let end: number = dayjs().unix(); // Current time

    // Calculate timestamps based on requested range
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
        headers: {
          Authorization: `JWT ${jwt}`,
        },
      });

      if (!response.ok) {
        console.error("Fetch failed:", response.status);
        return;
      }

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

  // 1. On Mount: Load from cache
  // 2. If no cache and JWT exists: Trigger initial fetch
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (e) {
        console.error("Cache corrupted, clearing...");
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // Only auto-fetch if we have no data at all
    if (!cached && jwt) {
      fetchToState('mtd');
    }
  }, [jwt, fetchToState]);

  const clearData = () => {
    setData([]);
    localStorage.removeItem(CACHE_KEY);
  };

  return (
    <ReportContext.Provider value={{ data, loading, refreshData: fetchToState, clearData }}>
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
