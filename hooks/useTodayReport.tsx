
import { useReport } from "@/context/ReportContext";
import { DayItem, Totals } from "@/domains/dashboard/report.types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMemo } from "react";

dayjs.extend(customParseFormat);

export default function useTodayReport(): {
    todayData: DayItem[];
    todayTotals: Totals;
} {
    const { data, minRate } = useReport();

    const { todayData, todayTotals } = useMemo(() => {

        // 1. Get today's date
        const today = dayjs().startOf("day");

        // 2. Filter today's records
        const filtered = data.filter((call) => {
            const callDate = dayjs(call.date, "MM/DD/YYYY", true);

            return callDate.isValid() && callDate.isSame(today, "day");
        });

        // 3. Calculate totals
        const totals = filtered.reduce(
            (acc, curr) => ({
                count: acc.count + 1,
                minutes: acc.minutes + curr.mins,
            }),
            { count: 0, minutes: 0 }
        );

        // 4. Transform records for today's view
        const todayData: DayItem[] = filtered.map((call) => {
            const usd = (curr: number) => curr * minRate;

            return {
                start: call.start,
                end: call.end,
                mins: call.mins.toFixed(2),
                usd: usd(call.mins),
            };
        });

        // 5. Calculate total USD
        const usd = totals.minutes * minRate;

        return {
            todayData,
            todayTotals: {
                ...totals,
                usd,
            },
        };

    }, [data, minRate]);

    return { todayData, todayTotals };
}
