'use client';

import { useReport } from "@/context/ReportContext";
import { Days, Expecting, Today, WeekTable } from "@/domains/dashboard/components";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export default function GeneralOverview() {
const { data } = useReport();

const startOfMonth = dayjs().startOf('month');
const endOfMonth = dayjs().endOf('month');
const today = dayjs();

	// Helper: Count business days
	const getBusinessDays = (start: any, end: any) => {
		let count = 0;
		let cur = dayjs(start);
		while (cur.isBefore(end) || cur.isSame(end, 'day')) {
			if (cur.day() !== 0 && cur.day() !== 6) count++;
				cur = cur.add(1, 'day');
			}
		return count;
	};

	const totalWorkingDays = getBusinessDays(startOfMonth, endOfMonth);
	const daysWorked = getBusinessDays(startOfMonth, today);
	const daysLeft = totalWorkingDays - daysWorked;

	const grandTotal = data.reduce((acc, row) => acc + (row.amount || 0), 0);
	const dailyAvg = daysWorked > 0 ? grandTotal / daysWorked : 0;
	const expectedTotal = grandTotal + (dailyAvg * daysLeft);

	return (
		<div className="grid grid-cols-3 grid-rows-2 surface-1 p-6 h-96">
			<Days />
			<Expecting />
			<WeekTable />
			<Today />
		</div>
	);
}
