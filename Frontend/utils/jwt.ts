import { Role } from "@/lib/types";

export function decodeTokenPayload(token: string): { role?: Role } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin-dashboard";
    case "PROVIDER":
      return "/provider-dashboard";
    case "CUSTOMER":
    default:
      return "/customer-dashboard";
  }
}
