"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const routes = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/dashboard/cars",
    label: "My Cars",
    icon: Car,
  },
  {
    href: "/dashboard/cars/new",
    label: "Add Car",
    icon: Plus,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
        >
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent" : "transparent"
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            <span>{route.label}</span>
          </span>
        </Link>
      ))}
      <Button
        variant="ghost"
        className="justify-start px-3"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </Button>
    </nav>
  );
}