import { ReportProvider } from "@/context/ReportContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReportProvider>
      <div className="flex flex-col min-h-screen">
        <header className="border-b p-4 flex justify-between items-center">
          <h1 className="font-bold text-fluid-xl ">Logo</h1>
          <nav className="flex gap-4 text-sm mr-20">
            <a href="/dashboard" className="hover:underline">Today</a>
            <a href="/dashboard/monthly" className="hover:underline">Monthly</a>
            <a href="/dashboard/overview" className="hover:underline">Overview</a>
            <a href="/dashboard/detailed" className="hover:underline">Detailed</a>
          </nav>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ReportProvider>
  );
}
