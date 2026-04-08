import { useReport } from "@/context/ReportContext";
import dayjs from "dayjs";
import { useMemo } from "react";

type TodayTotals = {
  count: number;
  minutes: number;
  usd: number;
};

export default function useTodayReport(): {
  todayData: any[];
  todayTotals: TodayTotals;
} {
  const { cleaned, minRate } = useReport();

  const today = dayjs().startOf("day");

  const { todayData, todayTotals } = useMemo(() => {
    // 1. Filter today's data
    const filtered = cleaned.filter((call) =>
      call.rawDate.isSame(today, "day")
    );

    // 2. Calculate totals
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
      todayData: filtered,
      todayTotals: {
        ...totals,
        usd,
      },
    };
  }, [cleaned, minRate, today]);

  return { todayData, todayTotals };
}