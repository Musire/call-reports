"use client";

import { Button } from "@/components/ui";
import { useReport } from "@/context/ReportContext";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

export default function RefreshButton() {
  const { refreshData, loading } = useReport();

  return (
    <Button
      variant="secondary"
      className={cn(
        "fixed top-3 right-6 z-50", 
        "min-w-0 w-10 h-10 p-0 flex items-center justify-center",
        loading && "opacity-50 pointer-events-none"
      )}
      onClick={() => refreshData()}
      disabled={loading}
    >
      <RefreshCw 
        className={cn("w-4 h-4", loading && "animate-spin")} 
      />
    </Button>
  );
}
