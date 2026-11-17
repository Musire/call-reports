
import Papa from "papaparse";
import type { ReportData } from "./report.types";

const START_TIME_COLUMN = 22;
const DURATION_SECONDS_COLUMN = 18;

function formatDateTime(date: Date) {
    const pad = (value: number) =>
        String(value).padStart(2, "0");

    const hours = date.getUTCHours();
    const hours12 = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";

    return {
        date: `${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${date.getUTCFullYear()}`,
        time: `${pad(hours12)}:${pad(date.getUTCMinutes())} ${period}`,
    };
}

export function normalizePrimaryData(csv: string): ReportData[] {

    // 1. Parse CSV without using headers
    const result = Papa.parse<string[]>(csv, {
        header: false,
        skipEmptyLines: true,
    });

    // 2. Remove summary row and skip header row
    const rows = result.data.slice(2);

    // 3. Normalize records
    return rows.flatMap((row) => {

        const startTimestamp = row[START_TIME_COLUMN];
        const durationSeconds = Number(
            row[DURATION_SECONDS_COLUMN]
        );

        if (!startTimestamp || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
            return [];
        }

        // 4. Parse EST timestamp
        const match = startTimestamp.match(
            /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) EST$/
        );

        if (!match) return [];

        const [, year, month, day, hour, minute, second] = match;

        // 5. Convert EST to CST (subtract one hour)
        const startDate = new Date(
            Date.UTC(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour) - 1,
                Number(minute),
                Number(second)
            )
        );

        // 6. Calculate end using duration seconds
        const endDate = new Date(
            startDate.getTime() + durationSeconds * 1000
        );

        // 7. Format date, start and end
        const start = formatDateTime(startDate);
        const end = formatDateTime(endDate);

        // 8. Return standardized record
        return [{
            date: start.date,
            start: start.time,
            end: end.time,
            mins: durationSeconds / 60,
        }];
    });
}
