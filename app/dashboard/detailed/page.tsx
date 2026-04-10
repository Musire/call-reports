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
import { processReportData } from "@/lib/dataUtils";
import { getRowColors } from "@/lib/mathUtils"; // adjust path if needed

export default function ReportTable() {
  const { cleaned, minRate } = useReport();
  const processedData = processReportData(cleaned, minRate);

  const timeHeaders = Array.from({ length: 15 }, (_, i) => i + 6);

  const formatHourLabel = (hour: number) => {
    if (hour === 12) return "12:00 PM";
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const getValue = (hourlyUsd: Record<number, number>, hour: number) => {
    return hourlyUsd[hour] || 0;
  };

  return (
    <div className="rounded-md border border-border max-h-[70dvh] overflow-x-auto bg-surface-1 ">
      <Table className="border-separate border-spacing-0">
        <TableHeader className="w-30 text-else sticky left-0 bg-surface-1 z-20 shadow-md">
          <TableRow className="">
            <TableHead style={{ left: '-1px' }}  className="w-30 text-else -ml-px ">Date</TableHead>

            {timeHeaders.map((hour) => (
              <TableHead key={hour} className="text-center text-else min-w-20 ">
                {formatHourLabel(hour)}
              </TableHead>
            ))}

            <TableHead className="text-right text-else">Occupancy</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {processedData.map((row, rowIndex) => {

            const rowValues = timeHeaders.map((hour) =>
              getValue(row.hourlyUsd, hour)
            );

            const colors = getRowColors(rowValues);

            return (
              <TableRow
                key={row.date}
                className="hover:bg-transparent border-background border "
              >
                <TableCell style={{ left: '-1px' }} className="font-medium  bg-surface-1 border-background border-t text-else sticky left-0 z-10 -ml-px shadow-[0_-1px_0_0_#1a1a1a]">
                  {row.date}
                </TableCell>

                {timeHeaders.map((hour, i) => {
                  const val = rowValues[i];
                  const bgColor = colors[i];
                  const isActive = val > 0;

                  return (
                    <TableCell
                      key={hour}
                      className="text-center p-0 h-10 transition-all border-none text-deep"
                      style={{ backgroundColor: bgColor }}
                    >
                      {isActive ? val.toFixed(2) : ""}
                    </TableCell>
                  );
                })}

                <TableCell className="text-right bg-surface-1 font-mono text-main">
                  {row.occupancy}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <RefreshButton />
    </div>
  );
}