'use client';

import { useCallEarnings } from "@/hooks";
import Days from "./Days";
import Expecting from "./Expecting";

export default function Aggregate() {
    const { 
        totalBusinessDays, businessDaysRemaining, avgDailyEarnings, 
        ...earnings 
    } = useCallEarnings();

    console.log(totalBusinessDays)

    return (
        <div className="stacked">
            <Days data={{ totalBusinessDays, businessDaysRemaining, avgDailyEarnings }} />
            <Expecting data={earnings} />
        </div>
    );
}
