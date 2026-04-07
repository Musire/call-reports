import { Body, Label } from "@/components/ui";

export default function Days () {
    return (
        <div className="row-span-2 border border-border p-4 stacked">
            <div className="grid grid-cols-3 grid-rows-3 place-items-center-safe">
                <p />
                <Label className="">USD</Label>
                <Label className="">Days</Label>
                <Label className="">Weekdays</Label>
                <Body className="">$917.93</Body>
                <Body className="">5</Body>
                <Label className="">Weekdays</Label>
                <Body className="">$0.00</Body>
                <Body className="">0</Body>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 place-items-center-safe">
                <Label>Month Days</Label>
                <Body>22</Body>
                <Label>Avg</Label><Label>Days Left</Label>
                <Body>17</Body>
                <Label>$183.59</Label>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 place-items-center-safe">
                <Label>USD</Label>
                <Body className="col-span-2">$917.93</Body>
                <Label>MXN</Label>
                <Body className="col-span-2">$16,339.07</Body>
            </div>
        </div>
    );
}