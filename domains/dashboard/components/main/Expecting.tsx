import { Label } from "@/components/ui";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatUtils";
import { PiggyBank } from "lucide-react";

// Define the shape of each row to make the map cleaner
type CurrencyRow = {
    label: string;
    actual: string | number;
    projected: string | number;
}

type Props = {
    data: {
        totalUsdEarned: string | number;
        projectedTotal: string | number;
        totalMxnEarned: string | number;
        projectedMxnTotal: string | number;
    }
}

export default function Expecting({ data }: Props) {
    // If 'data' is missing, return null to prevent the crash
    if (!data) return null;

    const rows: CurrencyRow[] = [
        { label: "USD", actual: data.totalUsdEarned, projected: data.projectedTotal },
        { label: "MXN", actual: data.totalMxnEarned, projected: data.projectedMxnTotal },
    ];

    return (
        <div className="w-full  surface-1 px-6 py-4 rounded-xl">
            <span className="font-heading text-sm font-medium flex items-center space-x-2 pb-4">
                <PiggyBank strokeWidth={1} />
                <Label className="font-[]">Expecting</Label>
            </span>
            <Table>
                <TableHeader>
                    <TableRow className="border-border">
                        <TableCell>Currency</TableCell>
                        <TableCell className="text-right">Actual</TableCell>
                        <TableCell className="text-right">Projected</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.label} className="border-border">
                            <TableCell className="px-2 py-1">{row.label}</TableCell>
                            <TableCell className="px-2 py-1 text-right">
                                {formatCurrency(row.actual)}
                            </TableCell>
                            <TableCell className="px-2 py-1 text-right">
                                {formatCurrency(row.projected)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
