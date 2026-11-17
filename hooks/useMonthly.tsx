import { useMemo } from "react";
import { useReport } from "@/context/ReportContext";
import transformToWeeklyData from "@/lib/dataUtils";

export default function useMonthly() {
    const { data, minRate } = useReport();

    const monthlyData = useMemo(
        () => transformToWeeklyData(data, minRate),
        [data, minRate]
    );

    const totals = useMemo(() => {
        const uniqueDays = new Set(
            data.map((item) => item.date)
        );

        const totalAmount = monthlyData.reduce(
            (total, month) => total + month.amount,
            0
        );

        return {
            amount: totalAmount,
            days: uniqueDays.size,
        };
    }, [data, monthlyData]);

    return {
        monthlyData,
        totalAmount: Math.round(totals.amount * 100) / 100,
        totalAvg: totals.days
            ? Math.round((totals.amount / totals.days) * 100) / 100
            : 0,
    };
}