import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Phone, Timer, Wallet } from "lucide-react";

const CONFIG = {
    calls: {
        Icon: Phone,
        title: 'Calls'
    },
    minutes: {
        Icon: Timer,
        title: 'Minutes'
    },
    earnings: {
        Icon: Wallet,
        title: 'Earnings'
    }
}

type Props = {
  value: number | string;
  variant: keyof typeof CONFIG
}

export default function StatCard ({ value, variant }: Props) {
    const { Icon, title } = CONFIG[variant]
    return (
        <Card className="w-fit shrink-0 bg-surface-1 border border-border min-w-28">
          <CardContent className="flex space-x-4 ">
            <dl className="grid grid-cols-2 items-center ">
              <span className="centered bg-surface-3 rounded-full size-8">
                <Icon size={20} strokeWidth={1} />
              </span>
              <dt className="text-sm text-else">{title}</dt>
              <dd className="text-fluid-xl col-span-2 text-center">{value}</dd>
            </dl>
          </CardContent>
        </Card>
    );
}