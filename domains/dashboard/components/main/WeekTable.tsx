'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMonthly from "@/hooks/useMonthly";

export default function WeeklyTable() {

  const { monthlyData, totalAmount, totalAvg } = useMonthly()

  return (
    <div className="w-full surface-1 max-w-3xl py-2 px-6 rounded-xl border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead></TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Finish</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Avg</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {monthlyData.map((row, i) => (
            <TableRow key={i} className="border-border">
              <TableCell>{row.week}</TableCell>
              <TableCell>{row.start}</TableCell>
              <TableCell>{row.finish}</TableCell>
              <TableCell className="text-right">
                {row.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {row.avg.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}

          {/* Spacer row */}
          <TableRow className="border-border">
            <TableCell colSpan={5} className="h-6 border-none" />
          </TableRow>

          {/* Total row */}
          <TableRow>
            <TableCell className="font-semibold">Total</TableCell>
            <TableCell />
            <TableCell />
            <TableCell className="text-right font-semibold">
              {totalAmount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {totalAvg.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}