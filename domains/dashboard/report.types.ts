
export type ReportData = {
    date: string;
    start: string;
    end: string;
    mins: number
}

export interface DailyGroup {
    date: string;
    dayName: string;
    count: number;
    minutes: number;
    usd: number;
    mxn: number;
}

export type DayItem = {
  start: string;
  end: string;
  mins: string;
  usd: number;
};

export type Totals = {
  count: number;
  minutes: number;
  usd: number;
};


export interface WeeklySummary {
  week: string;
  start: string;
  finish: string;
  amount: number;
  avg: number;
}


export interface RawInput {
  Date: string;
  Mins: number | null;
  Start: string;
  End: string;
  usd: number | null;
  mxn: number | null;
}


export type ProcessedReportRow = {
    date: string;
    hourlyUsd: Record<number, number>;
    occupancy: string;
};