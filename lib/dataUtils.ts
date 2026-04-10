import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export interface CallData {
  date: string;
  min: string;
  start: string;
  end: string;
  usd: string;
  rawMinutes: number;
  rawUsd: number;
  rawDate: Dayjs;
}

interface RawInput {
  __parsed_extra: (string | number | null)[];
}

export const transformRawData = (rawData: RawInput[]): CallData[] => {
  if (!Array.isArray(rawData) || rawData.length <= 1) return [];

  // .slice(1) skips the header row
  return rawData.slice(1).map((item) => {
    const extra = item.__parsed_extra;
    
    const START_TIME = dayjs(extra[20] as string);
    const END_TIME = dayjs(extra[21] as string);

    // 1. Get raw minutes 
    const rawMinutes = parseFloat(extra[17] as string) || 0;

    // 2. Calculate earnings based on full precision, then round to 2 decimals
    const EARNINGS = Math.round((rawMinutes * 0.75) * 100) / 100;

    // 3. Round minutes for the UI display (16.7)
    const DISPLAY_MINUTES = Math.round(rawMinutes * 10) / 10;

    return {
      date: START_TIME.format('MM/DD/YY'),
      min: DISPLAY_MINUTES.toFixed(1),
      start: START_TIME.format('hh:mm A'),
      end: END_TIME.format('hh:mm A'),
      usd: EARNINGS.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }),
      rawMinutes: DISPLAY_MINUTES,
      rawUsd: EARNINGS,
      rawDate: START_TIME
    };
  });
};

interface WeeklySummary {
  week: string;
  start: string;
  finish: string;
  amount: number;
  avg: number;
}


export const transformToWeeklyData = (calls: CallData[], minRate: number): WeeklySummary[] => {
  // Use a temporary type to track actual Date objects for comparison
  const weeks: (WeeklySummary & { _startRef?: any; _finishRef?: any })[] = Array.from({ length: 6 }, (_, i) => ({
    week: `Week ${i + 1}`,
    start: "",
    finish: "",
    amount: 0,
    avg: 0,
  }));

  const activeDaysPerWeek = Array.from({ length: 6 }, () => new Set<string>());

  calls.forEach((call) => {
    const date = call.rawDate;
    const startOfMonth = date.clone().startOf('month');
    const dayOfMonth = date.date();
    const firstDayOffset = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const weekIndex = Math.floor((dayOfMonth + firstDayOffset - 1) / 7);

    if (weekIndex >= 0 && weekIndex < 6) {
      const w = weeks[weekIndex];
      const dateStr = date.format("MM/DD"); // Simplified to MM/DD as requested
      
      // Update start if it's the first call seen or an earlier date
      if (!w._startRef || date.isBefore(w._startRef)) {
        w._startRef = date;
        w.start = dateStr;
      }
      
      // Update finish if it's the first call seen or a later date
      if (!w._finishRef || date.isAfter(w._finishRef)) {
        w._finishRef = date;
        w.finish = dateStr;
      }

      activeDaysPerWeek[weekIndex].add(date.format("YYYY-MM-DD"));
      
      const callDuration = call.rawMinutes || 0; 
      w.amount += (callDuration * minRate);
    }
  });

  return weeks.map((w, i) => {
    const uniqueDayCount = activeDaysPerWeek[i].size;
    
    return {
      week: w.week,
      start: w.start,
      finish: w.finish,
      amount: parseFloat(w.amount.toFixed(2)),
      avg: uniqueDayCount > 0 
        ? parseFloat((w.amount / uniqueDayCount).toFixed(4))
        : 0,
    };
  });
};


export const processReportData = (data: CallData[], minRate: number) => {
  const grouped: Record<string, any> = {};

  const getHour = (time: string): number | null => {
    if (!time) return null;

    const t = time.trim().toUpperCase();

    if (t.includes(":")) {
      const parts = t.split(":");
      let hour = parseInt(parts[0], 10);

      if (isNaN(hour)) return null;

      if (t.includes("PM") && hour !== 12) hour += 12;
      if (t.includes("AM") && hour === 12) hour = 0;

      return hour;
    }

    if (t.includes("AM") || t.includes("PM")) {
      let hour = parseInt(t.replace(/[^0-9]/g, ""), 10);

      if (isNaN(hour)) return null;

      if (t.includes("PM") && hour !== 12) hour += 12;
      if (t.includes("AM") && hour === 12) hour = 0;

      return hour;
    }

    const hour = parseInt(t, 10);
    if (!isNaN(hour)) return hour;


    return null;
  };

  data.forEach((call, i) => {
    const dateStr = call.date;

    if (!grouped[dateStr]) {
      grouped[dateStr] = {
        date: dateStr,
        hourlyUsd: {},
        totalMinutes: 0,
        maxInRow: 0
      };
    }

    const hour = getHour(call.start);


    if (hour !== null && hour >= 6 && hour <= 19) {
      const currentUsd = grouped[dateStr].hourlyUsd[hour] || 0;
      const newUsd = currentUsd + (call.rawMinutes * minRate);

      grouped[dateStr].hourlyUsd[hour] = newUsd;

      if (newUsd > grouped[dateStr].maxInRow) {
        grouped[dateStr].maxInRow = newUsd;
      }
    }

    grouped[dateStr].totalMinutes += call.rawMinutes;
  });

  return Object.values(grouped).map((row) => ({
    ...row,
    occupancy: ((row.totalMinutes / 600) * 100).toFixed(2) + "%"
  }));
};