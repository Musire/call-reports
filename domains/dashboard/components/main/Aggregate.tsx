'use client';

import { useCallEarnings } from "@/hooks";
import Days from "./Days";
import Expecting from "./Expecting";
import WeeklyTable from "./WeekTable";

export default function Aggregate() {
    const { 
        totalBusinessDays, businessDaysRemaining, avgDailyEarnings, 
        ...earnings 
    } = useCallEarnings();

    console.log(totalBusinessDays)

    return (
        <div className="grid grid-cols-1 grid-rows-[9rem_10rem_1fr] md:grid-rows-[10rem_1fr] md:grid-cols-4 flex-1 gap-4 md:ml-72 md:mt-24">
            <div className="md:row-start-2">
                <Days data={{ totalBusinessDays, businessDaysRemaining, avgDailyEarnings }} />
            </div>
            <Expecting data={earnings} />
            <div className="md:col-span-2">
                <WeeklyTable />
            </div>
        </div>
    );
}
