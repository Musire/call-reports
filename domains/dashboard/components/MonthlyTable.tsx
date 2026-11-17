
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/formatUtils";
import dayjs from "dayjs";
import { DailyGroup } from "../report.types";

type Props = {
    usdMxnRate: number;
    data: DailyGroup[];
};

export default function MonthlyTable({ data, usdMxnRate }: Props) {
    return (
        <div className="surface-1 rounded-md border border-border relative">
            <Table className="max-h-[65vh]">
                <TableHeader className="sticky top-0">
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
                    {!data.length ? (
                        <TableRow key="empty-state" className="border-border">
                            <TableCell colSpan={6} className="h-24 text-center">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow key={`${row.date}-${index}`} className="border-border">
                                <TableCell className="font-medium">
                                    {row.date}
                                </TableCell>

                                <TableCell className="w-10">
                                    {dayjs(row.date).format('dddd')}
                                </TableCell>

                                <TableCell className="text-center">
                                    {row.count}
                                </TableCell>

                                <TableCell className="text-right">
                                    {row.minutes.toFixed(1)}
                                </TableCell>

                                <TableCell className="text-right text-xs">
                                    {formatCurrency(row.usd)}
                                </TableCell>

                                <TableCell className="text-right font-medium text-xs">
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
    );
}
