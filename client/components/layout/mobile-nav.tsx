"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Camera, MapPin, MapPinned, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: BarChart3 },
  { href: "/cameras", label: "Cameras", icon: Camera },
  { href: "/zones", label: "Zones", icon: MapPin },
  { href: "/users", label: "Users", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav-bar">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("mobile-nav-item w-full", isActive && "active")}
            >
              <Icon className="w-6 h-6" />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href={"https://cctv-map.neuronomous.net"}
          target="_black"
          className="mobile-nav-item w-full"
        >
          <MapPinned className="w-6 h-6" />

          <span className="mt-1">Map</span>
        </Link>
      </div>
    </nav>
  );
}
