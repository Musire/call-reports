"use client";

import PageSection from "@/components/PageSection";
import { RefreshButton } from "@/domains/dashboard/components";
import StatCard from "@/domains/dashboard/components/StatCard";
import SummaryTable from "@/domains/dashboard/components/SummaryTable";
import { useTodayReport } from "@/hooks";
import { formatCurrency } from "@/lib/formatUtils";

export default function TodayTable() {
  const { todayData, todayTotals } = useTodayReport();

  return (
    <PageSection className=" ">
      <RefreshButton />
      {/* Today's Stats Card */}
      <div className="spaced overflow-x-scroll scrollbar-none w-full ">
        <StatCard value={todayTotals.count} variant="calls" />
        <StatCard value={todayTotals.minutes.toFixed(1)} variant="minutes" />
        <StatCard value={formatCurrency(todayTotals.usd)} variant="earnings" />
      </div>
      {/* Table Section */}
      <SummaryTable data={todayData} />
    </PageSection>
  );
}
