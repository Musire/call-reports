import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { useCallEarnings } from "@/hooks"
import { formatCurrency } from "@/lib/formatUtils"

export default function Days() {
    const {
        totalBusinessDays,
        businessDaysRemaining,
        totalUsdEarned,
        avgDailyEarnings,
        projectedTotal,
        totalMxnEarned,
        projectedMxnTotal} = useCallEarnings()

    return (
        <div className="w-full max-w-3xl surface-1 p-6 rounded-xl">
            <Table >
            <TableBody>
                {/* Month Days */}
                <TableRow>
                <TableCell className="px-2 py-1">Month Days</TableCell>
                <TableCell className="px-2 py-1 text-right">{totalBusinessDays}</TableCell>
                <TableCell className="text-right">Avg</TableCell>
                </TableRow>

                {/* Days Left */}
                <TableRow>
                <TableCell className="px-2 py-1">Days Left</TableCell>
                <TableCell className="px-2 py-1 text-right">{businessDaysRemaining}</TableCell>
                <TableCell className="px-2 py-1 text-right">
                    {formatCurrency(avgDailyEarnings)}
                </TableCell>
                </TableRow>

                {/* Spacer */}
                <TableRow>
                <TableCell colSpan={3} className="h-4" />
                </TableRow>

                {/* Currency Header */}
                <TableRow>
                <TableCell>Currency</TableCell>
                <TableCell className="text-right">Actual</TableCell>
                <TableCell className="text-right">Projected</TableCell>
                </TableRow>

                {/* USD */}
                <TableRow>
                <TableCell className="px-2 py-1">USD</TableCell>
                <TableCell className="px-2 py-1 text-right">
                    {formatCurrency(totalUsdEarned)}
                </TableCell>
                <TableCell className="px-2 py-1 text-right">
                    {formatCurrency(projectedTotal)}
                </TableCell>
                </TableRow>

                {/* MXN */}
                <TableRow>
                <TableCell className="px-2 py-1">MXN</TableCell>
                <TableCell className="px-2 py-1 text-right">
                    {formatCurrency(totalMxnEarned)}
                </TableCell>
                <TableCell className="px-2 py-1 text-right">
                    {formatCurrency(projectedMxnTotal)}
                </TableCell>
                </TableRow>

            </TableBody>
            </Table>
        </div>
    )
}