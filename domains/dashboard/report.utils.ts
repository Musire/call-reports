
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


const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};



export function appendReportRow(
  existingData: ReportData[],
  newRow: ReportData
): ReportData[] {
  return [...existingData, newRow];
}

export function saveToSecondaryStorage(newRow: ReportData): ReportData[] {
  const cached = localStorage.getItem("secondary");
  const existingData: ReportData[] = cached ? JSON.parse(cached) : [];
  const updatedData = appendReportRow(existingData, newRow);

  localStorage.setItem("secondary", JSON.stringify(updatedData));
  return updatedData;
}


export function parseVisitByRows(rawText: string): ReportData {
  const rows = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Convert alternating label/value rows into a map
  const fields = new Map<string, string>();

  for (let i = 0; i < rows.length - 1; i += 2) {
    fields.set(rows[i], rows[i + 1]);
  }

  // 1. Extract provider start time
  const rawStart = fields.get("Provider Start Time (Timezone)");

  if (!rawStart) {
    throw new Error("Missing provider start time");
  }

  const startMatch = rawStart.match(
    /^(\d{1,2}):(\d{2})\s+(am|pm)(?:\s+\w+)?$/i
  );

  if (!startMatch) {
    throw new Error("Invalid start time");
  }

  const [, rawHour, rawMin, ampmPart] = startMatch;

  const hour = Number(rawHour);
  const minute = Number(rawMin);

  if (hour < 1 || hour > 12 || minute > 59) {
    throw new Error("Invalid start time");
  }

  const start = `${rawHour.padStart(2, "0")}:${rawMin} ${ampmPart.toUpperCase()}`;

  // 2. Extract duration
  const rawDuration = fields.get("Duration");

  if (!rawDuration) {
    throw new Error("Missing duration");
  }

  const durationMatch = rawDuration.match(/^(\d+)\s+min\.?$/i);

  if (!durationMatch) {
    throw new Error("Invalid duration");
  }

  const mins = Number(durationMatch[1]);

  if (!Number.isFinite(mins) || mins <= 0) {
    throw new Error("Invalid duration");
  }

  // 3. Extract date from Created
  const rawDate = fields.get("Created");

  if (!rawDate) {
    throw new Error("Missing creation date");
  }

  const dateMatch = rawDate.match(
    /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+/
  );

  if (!dateMatch) {
    throw new Error("Invalid date format");
  }

  const [, monthName, day, year] = dateMatch;


  const month = MONTHS[monthName.slice(0, 3)];

  if (!month) {
    throw new Error("Invalid month");
  }

  const date = `${month}/${day.padStart(2, "0")}/${year}`;

  // 4. Calculate end time
  let hours24 = hour;

  if (ampmPart.toUpperCase() === "PM" && hours24 !== 12) {
    hours24 += 12;
  }

  if (ampmPart.toUpperCase() === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  const totalStartMins = hours24 * 60 + minute;
  const totalEndMins = totalStartMins + mins;

  const endHours24 = Math.floor((totalEndMins % 1440) / 60);
  const endMins = totalEndMins % 60;

  const endAmPm = endHours24 >= 12 ? "PM" : "AM";
  const endHours12 = endHours24 % 12 || 12;

  const end = `${String(endHours12).padStart(2, "0")}:${String(endMins).padStart(2, "0")} ${endAmPm}`;

  return {
    date,
    start,
    end,
    mins,
  };
}
