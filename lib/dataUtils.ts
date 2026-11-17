import { ProcessedReportRow, ReportData, WeeklySummary } from "@/domains/dashboard/report.types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


export default function transformToWeeklyData(
    data: ReportData[],
    minRate: number
): WeeklySummary[] {

    const grouped = data.reduce<Record<string, {
        week: number;
        month: string;
        dates: Set<string>;
        start: string;
        finish: string;
        firstDate: dayjs.Dayjs;
        lastDate: dayjs.Dayjs;
        amount: number;
    }>>((acc, item) => {

        const date = dayjs(
            item.date,
            ["MM/DD/YY", "MM/DD/YYYY", "YYYY-MM-DD"],
            true
        );

        if (!date.isValid()) return acc;

        // Monday = start of calendar week
        const firstDayOffset = (date.startOf("month").day() + 6) % 7;

        // Week number within the month
        const week = Math.floor(
            (date.date() - 1 + firstDayOffset) / 7
        ) + 1;

        const month = date.format("YYYY-MM");

        const key = `${month}-W${week}`;

        if (!acc[key]) {
            acc[key] = {
                week,
                month,
                dates: new Set(),
                start: item.date,
                finish: item.date,
                firstDate: date,
                lastDate: date,
                amount: 0,
            };
        }

        const group = acc[key];

        // Count unique worked dates
        group.dates.add(item.date);

        // Track actual first and last worked dates
        if (date.isBefore(group.firstDate)) {
            group.firstDate = date;
            group.start = item.date;
        }

        if (date.isAfter(group.lastDate)) {
            group.lastDate = date;
            group.finish = item.date;
        }

        // Accumulate earnings
        group.amount += item.mins * minRate;

        return acc;

    }, {});

    return Object.values(grouped)
        .sort((a, b) => a.firstDate.valueOf() - b.firstDate.valueOf())
        .map(group => {

            const daysWorked = group.dates.size;

            return {
                week: `Week ${group.week}`,
                start: group.start,
                finish: group.finish,
                amount: Math.round(group.amount * 100) / 100,
                avg: daysWorked
                    ? Math.round(
                        (group.amount / daysWorked) * 100
                    ) / 100
                    : 0,
            };
        });
}

export function processReportData(
    data: ReportData[],
    minRate: number
): ProcessedReportRow[] {

    const grouped = data.reduce<Record<string, {
        hourlyUsd: Record<number, number>;
        totalMinutes: number;
    }>>((acc, item) => {

        const hour = getStartHour(item.start);

        if (!acc[item.date]) {
            acc[item.date] = {
                hourlyUsd: {},
                totalMinutes: 0
            };
        }

        const row = acc[item.date];

        // Total minutes for daily occupancy
        row.totalMinutes += item.mins;

        // Only include hours displayed in the table (6 AM - 8 PM)
        if (hour !== null && hour >= 6 && hour <= 20) {
            row.hourlyUsd[hour] =
                (row.hourlyUsd[hour] || 0) + item.mins * minRate;
        }

        return acc;

    }, {});

    return Object.entries(grouped).map(([date, row]) => {

        return {
            date,
            hourlyUsd: row.hourlyUsd,
            occupancy: `${((row.totalMinutes / 600) * 100).toFixed(2)}%`
        };
    });
}

export function getStartHour(start: string | undefined): number | null {
    if (!start || typeof start !== "string") {
        return null;
    }

    const match = start.trim().match(
        /^(\d{1,2}):\d{2}\s*(AM|PM)$/i
    );

    if (!match) return null;

    let hour = Number(match[1]);
    const period = match[2].toUpperCase();

    if (period === "AM" && hour === 12) {
        hour = 0;
    } else if (period === "PM" && hour !== 12) {
        hour += 12;
    }

    return hour;
}


