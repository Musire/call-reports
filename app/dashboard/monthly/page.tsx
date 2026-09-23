'use client';

import PageSection from "@/components/PageSection";
import { useReport } from "@/context/ReportContext";
import { RefreshButton } from "@/domains/dashboard/components";
import MonthlyTable from "@/domains/dashboard/components/MonthlyTable";
import StatCard from "@/domains/dashboard/components/StatCard";
import { useReportData } from "@/hooks";
import { formatCurrency } from "@/lib/formatUtils";

export default function MonthlyPage() {
  const { cleaned, usdMxnRate } = useReport();
  const { groupedData, totals } = useReportData(cleaned, usdMxnRate);

  return (
    <PageSection>
      <RefreshButton />
      {/* 🔵 Totals Header (no labels) */}
      <div className="spaced w-full overflow-x-scroll scrollbar-none">
        <StatCard value={totals.count} variant='calls' />
        <StatCard value={totals.minutes.toFixed(1)} variant='minutes' />
        <StatCard value={formatCurrency(totals.usd)} variant='earnings' />
      </div>
      {/* 🔵 Table */}
      <MonthlyTable data={groupedData} usdMxnRate={usdMxnRate} />
    </PageSection>
  );
}