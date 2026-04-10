import { Theme } from "@/components/ui";
import { Intake, ViewToken } from "@/domains/dashboard/components";

export default function Home() {

  return (
    <main className="w-screen h-dvh p-6 stacked  " >
      <Theme />
      <Intake />
      <ViewToken />
    </main>
  );
}
