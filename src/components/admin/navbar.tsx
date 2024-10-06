"use client";
import { Button } from "../ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Images, PanelsTopLeft, Users } from "lucide-react";

export const AdminTabs = [
  {
    title: "Pages",
    href: "/admin/pages",
    icon: <PanelsTopLeft size={20} />,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: <Images size={20} />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users size={20} />,
  },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="mb-[-2px] flex gap-1">
        {AdminTabs.map((item) => (
          <li key={item.href}>
            <Button variant="ghost" className="gap-2 rounded-none px-2" asChild>
              <Link
                href={item.href}
                className={cn("border-b-2", {
                  "border-black": pathname.startsWith(item.href),
                })}
              >
                {item.icon}
                {item.title}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
