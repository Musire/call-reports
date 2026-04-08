import dayjs, { Dayjs } from 'dayjs';

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
  const weeks: WeeklySummary[] = Array.from({ length: 6 }, (_, i) => ({
    week: `Week ${i + 1}`,
    start: "",
    finish: "",
    amount: 0,
    avg: 0,
  }));

  const activeDaysPerWeek = Array.from({ length: 6 }, () => new Set<string>());

  calls.forEach((call) => {
    const date = call.rawDate;
    const startOfMonth = date.startOf('month');
    const dayOfMonth = date.date();
    const firstDayOffset = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const weekIndex = Math.floor((dayOfMonth + firstDayOffset - 1) / 7);

    if (weekIndex >= 0 && weekIndex < 6) {
      const w = weeks[weekIndex];
      activeDaysPerWeek[weekIndex].add(date.format("YYYY-MM-DD"));
      
      // NEW CALCULATION: minutes * rate
      // Replace 'duration' with your actual CallData property name
      const callDuration = call.rawMinutes || 0; 
      w.amount += (callDuration * minRate);

    }
  });

  return weeks.map((w, i) => {
    const uniqueDayCount = activeDaysPerWeek[i].size;
    
    return {
      ...w,
      amount: parseFloat(w.amount.toFixed(2)),
      // Calculating average based on the new total amount
      avg: uniqueDayCount > 0 
        ? parseFloat((w.amount / uniqueDayCount).toFixed(4)) // 4 decimals as requested earlier
        : 0,
    };
  });
};