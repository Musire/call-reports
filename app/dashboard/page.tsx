"use client";

import { Body } from "@/components/ui";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReport } from "@/context/ReportContext";
import { RefreshButton } from "@/domains/dashboard/components";
import { formatCurrency } from "@/lib/formatUtils";
import dayjs from "dayjs";

export default function TodayTable() {
  const { cleaned, minRate } = useReport();
  const today = dayjs().startOf("day");

  // 1. Filter today's data
  const todayData = cleaned
    .filter((call) => call.rawDate.isSame(today, "day"))
    .sort((a, b) => b.rawDate.valueOf() - a.rawDate.valueOf());

  // 2. Calculate today's totals
  const todayTotals = todayData.reduce(
    (acc, curr) => {
      // Convert formatted string back to exact cents (e.g., "$3.68" -> 368)
      const cents = Math.round(parseFloat(curr.usd.replace(/[$,]/g, "")) * 100);
      
      return {
        count: acc.count + 1,
        minutes: acc.minutes + curr.rawMinutes,
        usdInCents: acc.usdInCents + cents,
      };
    },
    { count: 0, minutes: 0, usdInCents: 0 }
  );

  // Convert back to dollars for display
  const finalUsd = todayTotals.minutes * minRate;

  return (
    <div className="stacked space-y-4">
      {/* Today's Stats Card */}
      <Card className="surface-1 w-fit self-end">
        <CardContent className="p-4 flex justify-end space-x-6">
          <Body className="text-lg font-semibold tracking-tight">
            {todayTotals.count} calls
          </Body>
          <Body className="text-lg font-semibold tracking-tight">
            {todayTotals.minutes.toFixed(1)} mins
          </Body>
          <Body className="text-lg font-semibold tracking-tight">
            {formatCurrency(finalUsd)}
          </Body>
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="rounded-md border surface-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Min</TableHead>
              <TableHead className="text-right">USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todayData.length > 0 ? (
              todayData.map((call, index) => (
                <TableRow key={index}>
                  <TableCell>{call.date}</TableCell>
                  <TableCell>{call.start}</TableCell>
                  <TableCell>{call.end}</TableCell>
                  <TableCell>{call.min}</TableCell>
                  <TableCell className="text-right font-mono">
                    {call.usd}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No calls recorded for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <RefreshButton />
      </div>
    </div>
  );
}
