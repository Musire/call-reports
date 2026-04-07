'use client';

import { Days, RefreshButton, WeekTable } from "@/domains/dashboard/components";


export default function GeneralOverview() {

    return (
        <div className="spaced space-x-24 p-6 h-96">
            <Days />
            <WeekTable />
            <RefreshButton />
        </div>
    );
}
