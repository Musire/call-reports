import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatUtils";

type Props = {
    data: {
        totalBusinessDays: number;
        businessDaysRemaining: number;
        avgDailyEarnings: number;
    }
}

export default function Days({ data }: Props) {
    // Return a skeleton or null if data hasn't loaded yet
    if (!data) return null;

    const stats = [
        { label: "Total", value: data.totalBusinessDays },
        { label: "Left", value: data.businessDaysRemaining },
        { label: "Avg", value: formatCurrency(data.avgDailyEarnings) },
    ];

    return (
        <Card className="surface-1 min-w-60">
            <CardContent className="evenly">
                {stats.map((stat) => (
                    <dl key={stat.label} className="flex flex-col items-center gap-1">
                        <dt className="text-fluid-xs text-muted-foreground">{stat.label}</dt>
                        <dd className="text-fluid-lg">{stat.value}</dd>
                    </dl>
                ))}
            </CardContent>
        </Card>
    );
}
