'use client';

import { Aggregate, RefreshButton } from "@/domains/dashboard/components";


export default function GeneralOverview() {

    return (
        <div className="flex-1 flex">
            <Aggregate />
            {/* <div className="grid grid-cols-1 grid-rows-[7rem_7rem_1fr] flex-1 gap-4">
                <div className="bg-o"></div>
                <div className="bg-lime-600"></div>
                <div className="bg-error"></div>
            </div> */}
            <RefreshButton />
        </div>
    );
}
