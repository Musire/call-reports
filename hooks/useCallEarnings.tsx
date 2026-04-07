'use client';

import { useReport } from '@/context/ReportContext';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const useCallEarnings = () => {
  // Destructure minRate from context
  const { cleaned, usdMxnRate, minRate } = useReport();

  return useMemo(() => {
    if (!cleaned || !Array.isArray(cleaned)) {
      return {
        totalBusinessDays: 0,
        businessDaysRemaining: 0,
        totalUsdEarned: "0.00",
        avgDailyEarnings: 0,
        projectedTotal: "0.00",
        totalMxnEarned: "0.00",
        projectedMxnTotal: "0.00",
      };
    }

    const today = dayjs().startOf('day');
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const conversionRate = usdMxnRate || 17.8;
    const ratePerMin = minRate || 0; // Fallback for minRate

    const getBusinessDays = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      let count = 0;
      let cur = dayjs(start); // Use a copy to avoid mutation
      while (cur.isBefore(end) || cur.isSame(end, 'day')) {
        const day = cur.day();
        if (day !== 0 && day !== 6) count++;
        cur = cur.add(1, 'day');
      }
      return count;
    };

    const totalBusinessDays = getBusinessDays(startOfMonth, endOfMonth);
    const businessDaysRemaining = getBusinessDays(today.add(1, 'day'), endOfMonth);
    const businessDaysPassed = totalBusinessDays - businessDaysRemaining;

    // Calculate USD based on (minutes * minRate)
    const totalUsdEarned = cleaned.reduce((acc, call) => {
      if (call.rawDate.isSame(startOfMonth, 'month')) {
        // Assuming call.minutes contains the duration
        return acc + ((call.rawMinutes || 0) * ratePerMin);
      }
      return acc;
    }, 0);

    const avgDailyEarningsUsd =
      businessDaysPassed > 0
        ? Math.round((totalUsdEarned / businessDaysPassed) * 10000) / 10000
        : 0;

    const projectedTotalUsd = avgDailyEarningsUsd * totalBusinessDays;

    const format = (val: number) => (Math.round(val * 100) / 100).toFixed(2);

    return {
      totalBusinessDays,
      businessDaysRemaining,
      totalUsdEarned: totalUsdEarned,
      avgDailyEarnings: avgDailyEarningsUsd,
      projectedTotal: projectedTotalUsd,
      totalMxnEarned: (totalUsdEarned * conversionRate),
      projectedMxnTotal: (projectedTotalUsd * conversionRate),
    };
  }, [cleaned, usdMxnRate, minRate]); // Added minRate to dependency array
};

export default useCallEarnings;
