'use client';

import { Aggregate, RefreshButton, WeekTable } from "@/domains/dashboard/components";


export default function GeneralOverview() {

    return (
        <div className="spaced space-x-24 p-6 h-96 stacked ml-4">
            <Aggregate />
            <WeekTable />
            <RefreshButton />
        </div>
    );
}
