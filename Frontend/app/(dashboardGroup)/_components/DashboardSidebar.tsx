"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { dashboardNav } from "../_config/dashboardNav";
import { logoutAction } from "@/service/getMe";
import { toast } from "sonner";

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const navItems = dashboardNav[user.role] || dashboardNav.CUSTOMER;

  async function handleLogout() {
    await logoutAction();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Dumbbell className="h-5 w-5 text-primary" /> GearUp
        </Link>
        <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 border-r bg-card transform transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <Link href="/" className="hidden lg:flex items-center gap-2 font-bold text-lg mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Dumbbell className="h-4 w-4" />
            </div>
            GearUp
          </Link>

          <div className="px-2 mb-6">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 pt-4 border-t">
            <ThemeToggle />
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
