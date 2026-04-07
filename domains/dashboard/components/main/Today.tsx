import { Body, Label } from "@/components/ui";
import dayjs from "dayjs";

export default function Today () {
    const localDate = dayjs().format("MM/DD/YYYY")
    return (
        <div className="border border-border p-4 centered">
            <span className="flex items-center space-x-6">
                <Label >Today</Label>
                <Body>{localDate}</Body>
            </span>
        </div>
    );
}