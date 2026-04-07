// app/(dashboard)/monthly/page.tsx
'use client';
import { useReport } from "@/context/ReportContext";
import dayjs from "dayjs";
import { useState } from "react";

export default function MonthlyPage() {
  const { data } = useReport();
  const [rates, setRates] = useState({ usdMxn: 17.10, minRate: 0.15 });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 border rounded-lg bg-slate-50">
        <label className="text-sm font-medium">USD-MXN: 
          <input type="number" value={rates.usdMxn} onChange={e => setRates({...rates, usdMxn: +e.target.value})} className="ml-2 border rounded p-1 w-20" />
        </label>
        <label className="text-sm font-medium">Rate per Min: 
          <input type="number" value={rates.minRate} onChange={e => setRates({...rates, minRate: +e.target.value})} className="ml-2 border rounded p-1 w-20" />
        </label>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Weekday</th>
            <th className="p-2 border">Calls</th>
            <th className="p-2 border">Minutes</th>
            <th className="p-2 border">Total USD</th>
            <th className="p-2 border">Total MXN</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const usd = row.minutes * rates.minRate;
            return (
              <tr key={i} className="hover:bg-accent/50">
                <td className="p-2 border">{row.date}</td>
                <td className="p-2 border">{dayjs(row.date).format('dddd')}</td>
                <td className="p-2 border">{row.calls}</td>
                <td className="p-2 border">{row.minutes}</td>
                <td className="p-2 border">${usd.toFixed(2)}</td>
                <td className="p-2 border">${(usd * rates.usdMxn).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
