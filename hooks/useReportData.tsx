import dayjs from "dayjs";
import { useMemo } from "react";

import { useReport } from "@/context/ReportContext";
import { DailyGroup, Totals } from "@/domains/dashboard/report.types";


interface UseReportDataReturn {
    groupedData: DailyGroup[];
    totals: Totals;
}

// --- Hook ---
export default function useReportData(
): UseReportDataReturn {

    const { data, minRate, usdMxnRate } = useReport();

    // 1. Group records by date
    const groupedData = useMemo(() => {

        const groupedObj = data.reduce<
            Record<string, Omit<DailyGroup, "dayName" | "mxn">>
        >((acc, row) => {

            if (!acc[row.date]) {
                acc[row.date] = {
                    date: row.date,
                    count: 0,
                    minutes: 0,
                    usd: 0,
                };
            }

            const entry = acc[row.date];

            entry.count += 1;
            entry.minutes += row.mins;

            // Calculate USD from total minutes to prevent rounding drift
            entry.usd = Math.round((entry.minutes * minRate) * 100) / 100;

            return acc;

        }, {});

        // 2. Transform grouped data
        return Object.values(groupedObj).map((group) => ({
            ...group,
            dayName: dayjs(group.date).format("dddd"),
            mxn: group.usd * usdMxnRate,
        }));

    }, [data, usdMxnRate, minRate]);

    // 3. Calculate totals
    const totals = useMemo(() => {

        const baseTotals = data.reduce(
            (acc, curr) => {
                acc.count += 1;
                acc.minutes += curr.mins;

                return acc;
            },
            { count: 0, minutes: 0 }
        );

        return {
            ...baseTotals,
            usd: Math.round((baseTotals.minutes * minRate) * 100) / 100,
        };

    }, [data, minRate]);

    return { groupedData, totals };
}