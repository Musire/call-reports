'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useReport } from "@/context/ReportContext";
import { RefreshButton } from "@/domains/dashboard/components";
import { useReportData } from "@/hooks";
import { formatCurrency } from "@/lib/formatUtils";
import dayjs from "dayjs";

export default function MonthlyPage() {
  const { cleaned, usdMxnRate } = useReport();
  
  const { groupedData, totals } = useReportData(cleaned, usdMxnRate);

  return (
    <div className="space-y-4">
      {/* 🔵 Totals Header (no labels) */}
      <div className="border-b pb-2 px-2 flex justify-end space-x-6 text-lg font-semibold tracking-tight">
        <span>{totals.count} calls</span>
        <span>{totals.minutes.toFixed(1)} mins</span>
        <span>{formatCurrency(totals.usd)}</span>
      </div>

      {/* 🔵 Table */}
      <div className="surface-1 rounded-md border h-[65vh] overflow-y-auto relative">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky top-0 bg-surface-1 z-20">Date</TableHead>
              <TableHead className="sticky top-0 bg-surface-1 z-20">Day</TableHead>
              <TableHead className="sticky top-0 bg-surface-1 z-20 text-center">#</TableHead>
              <TableHead className="sticky top-0 bg-surface-1 z-20 text-right">Min</TableHead>
              <TableHead className="sticky top-0 bg-surface-1 z-20 text-right">USD</TableHead>
              <TableHead className="sticky top-0 bg-surface-1 z-20 text-right">MXN</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              groupedData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell>{dayjs(row.date).format('dddd')}</TableCell>
                  <TableCell className="text-center">{row.count}</TableCell>
                  <TableCell className="text-right">{row.minutes.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.usd)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(row.usd * usdMxnRate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <RefreshButton />
    </div>
  );
}