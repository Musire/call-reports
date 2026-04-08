'use client';

import { useJwt } from "@/hooks";
import { CallData, transformRawData } from '@/lib/dataUtils';
import dayjs from 'dayjs';
import * as Papa from "papaparse";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type TimeRange = 'today' | 'mtd' | 'last7days';

interface ReportContextType {
  data: any[];
  loading: boolean;
  refreshData: (range?: TimeRange) => Promise<void>;
  clearData: () => void;
  cleaned: CallData[];
  // New rates added to context
  minRate: number;
  usdMxnRate: number;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const CACHE_KEY = 'report_cache_data';
const MIN_RATE_KEY = 'min_usd_rate';
const USD_MXN_KEY = 'usd_mxn_rate';

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const { jwt } = useJwt();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Rate states with default values
  const [minRate, setMinRate] = useState(0.75);
  const [usdMxnRate, setUsdMxnRate] = useState(17.8);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMin = localStorage.getItem(MIN_RATE_KEY);
      const storedMxn = localStorage.getItem(USD_MXN_KEY);
      
      if (storedMin) setMinRate(parseFloat(storedMin));
      if (storedMxn) setUsdMxnRate(parseFloat(storedMxn));
    }
  }, []);

  const updateData = (newData: any[]) => {
    setData(newData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
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

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try { 
        setData(JSON.parse(cached)); 
      } catch { 
        localStorage.removeItem(CACHE_KEY); 
      }
    }
    if (!cached && jwt) fetchToState('mtd');
  }, [jwt, fetchToState]);

  const clearData = () => {
    setData([]);
    localStorage.removeItem(CACHE_KEY);
  };

  // Pass rates to your transform helper
  const cleaned = transformRawData(data);

  return (
    <ReportContext.Provider value={{
        data, 
        loading, 
        refreshData: fetchToState, 
        clearData, 
        cleaned,
        minRate,
        usdMxnRate 
      }}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReport must be used within a ReportProvider");
  return context;
};
