'use client';

import { Card, CardContent } from "@/components/ui/card";
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
import { Phone, Timer, Wallet } from "lucide-react";

export default function MonthlyPage() {
  const { cleaned, usdMxnRate } = useReport();
  
  const { groupedData, totals } = useReportData(cleaned, usdMxnRate);

  return (
    <div className="space-y-4">
      {/* 🔵 Totals Header (no labels) */}
      <div className="flex space-x-4 w-full overflow-x-scroll scrollbar-none">
        <Card className="w-fit shrink-0 bg-surface-1">
          <CardContent className="flex space-x-2">
            <span className="centered bg-surface-3 rounded-full size-7">
              <Phone size={15} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Calls</dt>
              <dd className="text-fluid-xl">{totals.count}</dd>
            </dl>
          </CardContent>
        </Card>
        <Card className="w-fit shrink-0 bg-surface-1">
          <CardContent className="flex space-x-2">
            <span className="centered bg-surface-3 rounded-full size-7">
              <Timer size={15} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Minutes</dt>
              <dd className="text-fluid-xl">{totals.minutes.toFixed(1)}</dd>
            </dl>
          </CardContent>
        </Card>
        <Card className="w-fit shrink-0 bg-surface-1">
          <CardContent className="flex space-x-2">
            <span className="centered bg-surface-3 rounded-full size-7">
              <Wallet size={15} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Earnings</dt>
              <dd className="text-fluid-xl">{formatCurrency(totals.usd)}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>
      {/* 🔵 Table */}
      <div className="surface-1 rounded-md border border-border max-h-[65vh] overflow-y-auto relative">
        <Table >
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
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
              <TableRow className="border-border">
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              groupedData.map((row) => (
                <TableRow key={row.date} className="border-border">
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