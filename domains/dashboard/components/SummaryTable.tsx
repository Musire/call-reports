"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: any
}

export default function SummaryTable ({ data }: Props) {
    return (
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
                    {data.length > 0 ? (
                    data.map((call, index) => (
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
        </div>
    );
}