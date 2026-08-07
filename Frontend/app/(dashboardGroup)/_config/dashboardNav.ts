import { Role } from "@/lib/types";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const dashboardNav: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/customer-dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/customer-dashboard/orders", icon: ShoppingBag },
    { label: "Payments", href: "/customer-dashboard/payments", icon: CreditCard },
    { label: "Profile", href: "/customer-dashboard/profile", icon: Settings },
  ],
  PROVIDER: [
    { label: "Overview", href: "/provider-dashboard", icon: LayoutDashboard },
    { label: "My Gear", href: "/provider-dashboard/gear", icon: Package },
    { label: "Add Gear", href: "/provider-dashboard/gear/new", icon: PlusCircle },
    { label: "Orders", href: "/provider-dashboard/orders", icon: ShoppingBag },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin-dashboard/users", icon: Users },
    { label: "All Gear", href: "/admin-dashboard/gear", icon: Package },
    { label: "All Rentals", href: "/admin-dashboard/rentals", icon: ShoppingBag },
  ],
};
