'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReport } from "@/context/ReportContext";
import { transformToWeeklyData } from "@/lib/dataUtils";

export default function WeeklyTable() {

  const { cleaned, minRate } = useReport();
  const data = transformToWeeklyData(cleaned, minRate || 0);;

  const totalAmount = data.reduce((sum, row) => sum + row.amount, 0);

  const totalAvg = data.length > 0 
    ? parseFloat((data.reduce((sum, row) => sum + row.avg, 0) / data.length).toFixed(4))
    : 0;

  return (
    <div className="w-full  surface-1 max-w-3xl p-6 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Finish</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Avg</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
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
          <TableRow>
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