"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      icon: HomeIcon,
      label: "Dashboard",
    },
    {
      href: "/resume",
      icon: FileTextIcon,
      label: "Resume",
    },
    {
      href: "/profile",
      icon: UserIcon,
      label: "Profile",
    },
    {
      href: "/settings",
      icon: SettingsIcon,
      label: "Settings",
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            dSonic Resume Builder
          </h2>
          <Separator className="my-4" />
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
