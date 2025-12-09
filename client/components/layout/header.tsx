"use client";

import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Camera,
  MapPin,
  MapPinned,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { href: "/", label: "Home", icon: BarChart3 },
  { href: "/cameras", label: "Camera List", icon: Camera },
  { href: "/zones", label: "Zones", icon: MapPin },
  { href: "/users", label: "Users", icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex max-w-7xl mx-auto h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="">
          <div className="hidden md:flex items-center gap-3">
            <div className=" rounded-lg  flex items-center justify-center shadow-lg">
              <Image src="/sust.png" alt="Logo" width={52} height={52} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">SUST CCTV</h1>
              <p className="text-xs text-muted-foreground">Monitoring System</p>
            </div>
          </div>
        </Link>

        <div className="md:hidden flex flex-1 md:flex-0 items-center gap-2">
          <div className=" rounded-lg  flex items-center justify-center shadow-lg">
            <Image src="/sust.png" alt="Logo" width={52} height={52} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">SUST CCTV</h1>
            <p className="text-xs text-muted-foreground">Monitoring System</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href={"https://cctv-map.neuronomous.net"}
            target="_black"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium text-foreground hover:bg-muted"
            )}
          >
            <MapPinned className="w-4 h-4" />
            <span>Camera Map</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-100 rounded-full border border-blue-300"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <hr />

              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
