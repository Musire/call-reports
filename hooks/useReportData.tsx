import { useMemo } from 'react';
import dayjs from 'dayjs';

// --- Types ---
interface CallRecord {
  date: string;
  rawMinutes: number;
  rawUsd: number;
}

interface DailyGroup {
  date: string;
  dayName: string;
  count: number;
  minutes: number;
  usd: number;
  mxn: number;
}

interface Totals {
  count: number;
  minutes: number;
  usd: number;
}

interface UseReportDataReturn {
  groupedData: DailyGroup[];
  totals: Totals;
}

// --- Hook ---
export default function useReportData  (
  cleaned: CallRecord[], 
  usdMxnRate: number
): UseReportDataReturn {

  const groupedData = useMemo(() => {
    const groupedObj = cleaned.reduce<Record<string, Omit<DailyGroup, 'dayName' | 'mxn'>>>((acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = {
          date: row.date,
          count: 0,
          minutes: 0,
          usd: 0
        };
      }

      const entry = acc[row.date];
      entry.count += 1;
      // Use += for minutes to get the precise sum of the day
      entry.minutes += row.rawMinutes;
      
      // Calculate USD from the summed minutes to prevent rounding drift
      // 278.9 * 0.75 = 209.175 -> rounds to 209.18
      entry.usd = Math.round((entry.minutes * 0.75) * 100) / 100;

      return acc;
    }, {});

    // Map to final format including derived MXN and Day Name
    return Object.values(groupedObj).map(group => ({
      ...group,
      dayName: dayjs(group.date).format('dddd'),
      mxn: group.usd * usdMxnRate
    }));
  }, [cleaned, usdMxnRate]);

  const totals = useMemo(() => {
    const baseTotals = cleaned.reduce(
      (acc, curr) => {
        acc.count += 1;
        acc.minutes += curr.rawMinutes;
        return acc;
      },
      { count: 0, minutes: 0 }
    );

    return {
      ...baseTotals,
      // Calculate global USD total from global total minutes
      usd: Math.round((baseTotals.minutes * 0.75) * 100) / 100
    };
  }, [cleaned]);

  return { groupedData, totals };
};
