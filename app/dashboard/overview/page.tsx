'use client';

import { Aggregate, RefreshButton } from "@/domains/dashboard/components";


export default function GeneralOverview() {

    return (
        <div className="flex-1 flex ">
            <Aggregate />
            <RefreshButton />
        </div>
    );
}
