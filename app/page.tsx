import { Intake, ViewToken } from "@/domains/dashboard/components";
import Link from "next/link";

export default function Home() {

  return (
    <main className="w-screen h-dvh p-6 stacked" >
      <Link href="/dashboard" className="text-lg text-else hover:text-main self-end">Dashboard</Link>
      <Intake />
      <ViewToken />
    </main>
  );
}
