"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Menu, X, User as UserIcon, Settings, HelpCircle, LogOut, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { getDashboardPath } from "@/utils/jwt";
import { logoutAction } from "@/service/logout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Browse Gear" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const authenticatedLinks = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Browse Gear" },
  { href: "/blog", label: "Blog" },
];

export function Navbar({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const navLinks = user ? authenticatedLinks : publicLinks;

  async function handleLogout() {
    await logoutAction();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 glass border-b backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
          </div>
          GearUp
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href={getDashboardPath(user.role)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.includes("dashboard") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(" ")[0] || "User"}</span>
                </div>
              }
            >
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuItem href={`${getDashboardPath(user.role)}`}>
                <Settings className="inline h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem href="/help">
                <HelpCircle className="inline h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <div className="border-t my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer text-destructive"
              >
                <LogOut className="inline h-4 w-4 mr-2" />
                Logout
              </button>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t p-4 space-y-3 animate-fade-in bg-background">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 hover:text-primary" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href={getDashboardPath(user.role)} className="block py-2 hover:text-primary" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}
          <div className="flex gap-2 pt-2 border-t">
            {user ? (
              <div className="w-full space-y-2">
                <div className="text-sm font-medium px-2">{user.name}</div>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/help">Help & Support</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
