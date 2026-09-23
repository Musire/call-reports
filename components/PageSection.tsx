import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
}

export default function PageSection ({ children, className }: Props) {
    return (
        <section className={cn(" xs:w-[calc(100%)] flex flex-1 stacked space-y-4 max-w-3xl mx-auto", className)}>
            {children}
        </section>
    );
}