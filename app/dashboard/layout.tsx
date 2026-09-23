import { ReportProvider } from "@/context/ReportContext";
import { Navbar } from "@/domains/dashboard/components";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReportProvider>
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        <header className="border-b py-4 px-6 flex  w-full items-center">
          <Navbar />
        </header>
        <main className="flex-1 p-6 flex flex-col scrollbar-none ">{children}</main>
      </div>
    </ReportProvider>
  );
}
