import { useReport } from "@/context/ReportContext";
import dayjs from "dayjs";
import { useMemo } from "react";

export type TodayDataItem = {
  rawDate: dayjs.Dayjs;
  rawMinutes: number;
  start: string;
  end: string;
  min: string;
  usd: string;
};

type TodayTotals = {
  count: number;
  minutes: number;
  usd: number;
};

export default function useTodayReport(): {
  todayData: TodayDataItem[];
  todayTotals: TodayTotals;
} {
  const { cleaned, minRate } = useReport();

  const { todayData, todayTotals } = useMemo(() => {
    // Instantiate date context strictly inside useMemo to preserve cache dependency matching
    const today = dayjs().startOf("day");

    // 1. Filter today's data
    const filtered = cleaned.filter((call) =>
      call.rawDate.isSame(today, "day")
    );

    // 2. Calculate totals safely
    const totals = filtered.reduce(
      (acc, curr) => {
        return {
          count: acc.count + 1,
          minutes: acc.minutes + curr.rawMinutes,
        };
      },
      { count: 0, minutes: 0 }
    );

    // 3. Compute USD (single source of truth)
    const usd = totals.minutes * minRate;

    return {
      todayData: filtered as TodayDataItem[],
      todayTotals: {
        ...totals,
        usd,
      },
    };
  }, [cleaned, minRate]); // Removed 'today' from dependencies since it's computed internally

  return { todayData, todayTotals };
}
