'use client'
import { ReportData } from "@/domains/dashboard/report.types";
import { appendReportRow, parseVisitByRows } from "@/domains/dashboard/report.utils";
import { useState, useTransition } from "react";

type ButtonStatus = "idle" | "success" | "error";

export default function NewAppointment() {
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<ButtonStatus>("idle");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!textInput.trim() || isPending) return;

    // Reset error/success state when starting a new attempt
    setStatus("idle");

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      try {
        // 1. Parse and validate (throws if shape is wrong)
        const formatted = parseVisitByRows(textInput);

        // 2. Fetch the cached "secondary" value
        const cached = localStorage.getItem("secondary");
        const oldData: ReportData[] = cached ? JSON.parse(cached) : [];
        if (!Array.isArray(oldData)) {
          throw new Error("Corrupted storage");
        }

        // 3. Combine old value and new value
        const updatedData = appendReportRow(oldData, formatted);

        // 4. Save back to localStorage and reset input
        localStorage.setItem("secondary", JSON.stringify(updatedData));
        setTextInput("");
        setStatus("success");

        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        // Keep textInput so user can fix/retry without losing what they pasted
        setStatus("error");
      }
    });
  };

  const buttonColorClass =
    status === "error"
      ? "bg-error/20 border border-error hover:bg-error/30 text-error"
      : status === "success"
      ? "bg-success/20 border border-success "
      : "bg-main hover:bg-darken-2/main text-background";

  return (
    <div className="flex-1 flex">
      <div className="stacked flex-1">
        <textarea
          name="appointmentText"
          id="appointmentText"
          className="border border-border rounded-lg min-h-96 flex-1 p-4"
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            if (status === "error") setStatus("idle");
          }}
        />
        <button
          type="button"
          disabled={isPending}
          className={`text-xl cursor-pointer w-full rounded-lg normal-space h-16 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 ${buttonColorClass}`}
          onClick={handleSave}
        >
          {isPending ? (
            <span className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : status === "error" ? (
            <span>Retry</span>
          ) : status === "success" ? (
            <span>✓ Added</span>
          ) : (
            <span>+ Appointment</span>
          )}
        </button>
      </div>
    </div>
  );
}
