import { Body, H3, Label } from "@/components/ui";

export default function Expecting () {
    return (
        <div className="border border-border p-4 flex flex-col items-center space-y-4">
            <H3 className="">Expecting</H3>
            <span className="spaced w-40">
                <Label className="">USD</Label>
                <Body className="">$4038.87</Body>
            </span>
            <span className="spaced w-40">
                <Label className="">MXN</Label>
                <Body className="">$71,891.89</Body>
            </span>
        </div>
    );
}