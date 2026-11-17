
'use client';

import { useReport } from '@/context/ReportContext';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const useCallEarnings = () => {
    const { data, usdMxnRate, minRate } = useReport();

    return useMemo(() => {
        if (!Array.isArray(data)) {
            return {
                totalBusinessDays: 0,
                businessDaysRemaining: 0,
                totalUsdEarned: 0,
                avgDailyEarnings: 0,
                projectedTotal: 0,
                totalMxnEarned: 0,
                projectedMxnTotal: 0,
            };
        }

        const today = dayjs().startOf('day');
        const startOfMonth = today.startOf('month');
        const endOfMonth = today.endOf('month');

        const conversionRate = usdMxnRate ?? 17.8;
        const ratePerMin = minRate ?? 0;

        const getBusinessDays = (
            start: dayjs.Dayjs,
            end: dayjs.Dayjs
        ) => {
            let count = 0;
            let cur = start.clone();

            while (cur.isBefore(end) || cur.isSame(end, 'day')) {
                const day = cur.day();

                if (day !== 0 && day !== 6) {
                    count++;
                }

                cur = cur.add(1, 'day');
            }

            return count;
        };

        const totalBusinessDays = getBusinessDays(
            startOfMonth,
            endOfMonth
        );

        const businessDaysRemaining = getBusinessDays(
            today.add(1, 'day'),
            endOfMonth
        );

        const businessDaysPassed =
            totalBusinessDays - businessDaysRemaining;

        // Calculate earnings using the new ReportData structure
        const totalUsdEarned = data.reduce((acc, call) => {
            if (dayjs(call.date).isSame(startOfMonth, 'month')) {
                return acc + (call.mins * ratePerMin);
            }

            return acc;
        }, 0);

        const avgDailyEarnings =
            businessDaysPassed > 0
                ? totalUsdEarned / businessDaysPassed
                : 0;

        const projectedTotal =
            avgDailyEarnings * totalBusinessDays;

        return {
            totalBusinessDays,
            businessDaysRemaining,
            totalUsdEarned,
            avgDailyEarnings,
            projectedTotal,
            totalMxnEarned: totalUsdEarned * conversionRate,
            projectedMxnTotal: projectedTotal * conversionRate,
        };

    }, [data, usdMxnRate, minRate]);
};

export default useCallEarnings;
