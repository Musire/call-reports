"use client";

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
import { RefreshButton } from "@/domains/dashboard/components";
import { useTodayReport } from "@/hooks";
import { formatCurrency } from "@/lib/formatUtils";
import { Phone, Timer, Wallet } from "lucide-react";

export default function TodayTable() {
  const { todayData, todayTotals } = useTodayReport();

  return (
    <div className="stacked space-y-4 ">
      {/* Today's Stats Card */}
      <div className="flex space-x-4 overflow-x-scroll scrollbar-none w-full">
        <Card className="w-fit shrink-0 bg-surface-1 ">
          <CardContent className="flex space-x-4 ">
            <span className="centered bg-surface-3 rounded-full size-8">
              <Phone size={20} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Calls</dt>
              <dd className="text-fluid-xl">{todayTotals.count}</dd>
            </dl>
          </CardContent>
        </Card>
        <Card className="w-fit shrink-0 bg-surface-1">
          <CardContent className="flex space-x-4">
            <span className="centered bg-surface-3 rounded-full size-8">
              <Timer size={20} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Minutes</dt>
              <dd className="text-fluid-xl">{todayTotals.minutes.toFixed(1)}</dd>
            </dl>
          </CardContent>
        </Card>
        <Card className="w-fit shrink-0 bg-surface-1 rounded-xl border-none">
          <CardContent className="flex space-x-4">
            <span className="centered bg-surface-3 rounded-full size-8">
              <Wallet size={20} strokeWidth={1} />
            </span>
            <dl>
              <dt className="text-fluid text-else">Earnings</dt>
              <dd className="text-fluid-xl">{formatCurrency(todayTotals.usd)}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>
      {/* Table Section */}
      <div className="rounded-md border border-border surface-1 max-w-4xl w-full self-end">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
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
