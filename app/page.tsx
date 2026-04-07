import { Theme } from "@/components/ui";
import { Rendering } from "@/domains/dashboard/components";

export default function Home() {

  return (
    <main className="w-screen h-dvh p-6 stacked" >
      <Theme />
      <Rendering />
    </main>
  );
}
