// app/(dashboard)/detailed/page.tsx
'use client';
import { useReport } from "@/context/ReportContext";

export default function DetailedPage() {
  const { data } = useReport();
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 06:00 to 19:00

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-1 border">Date</th>
            {hours.map(h => <th key={h} className="p-1 border">{h}:00</th>)}
            <th className="p-1 border bg-blue-50">Occupancy %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            // Logic: Count hours between 8 and 18 that have earnings > 0
            let activeHours = 0;
            const windowHours = hours.filter(h => h >= 8 && h <= 18);
            
            windowHours.forEach(h => {
              if (row[`hour_${h}`] > 0) activeHours++;
            });

            const occupancy = (activeHours / windowHours.length) * 100;

            return (
              <tr key={i}>
                <td className="p-1 border font-bold italic">{row.date}</td>
                {hours.map(h => (
                  <td key={h} className={`p-1 border text-center ${row[`hour_${h}`] > 0 ? 'bg-green-100' : ''}`}>
                    {row[`hour_${h}`] || '-'}
                  </td>
                ))}
                <td className="p-1 border font-bold bg-blue-50 text-center">
                  {occupancy.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
