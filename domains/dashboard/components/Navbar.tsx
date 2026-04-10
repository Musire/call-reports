"use client";

import { usePathname } from "next/navigation";
import Navlink from "./Navlink";

const NAV_ITEMS = [
  { label: "Today", href: "/dashboard" },
  { label: "Monthly", href: "/dashboard/monthly" },
  { label: "Overview", href: "/dashboard/overview" },
  { label: "Detailed", href: "/dashboard/detailed" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-3 text-xs mr-14 items-center">
      {NAV_ITEMS.map((item) => (
        <Navlink
          key={item.href}
          href={item.href}
          isActive={pathname === item.href}
        >
          {item.label}
        </Navlink>
      ))}
    </nav>
  );
}
