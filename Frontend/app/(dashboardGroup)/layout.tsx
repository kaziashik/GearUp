import { getMe } from "@/service/getMe";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { AuthenticationFallback } from "./_components/AuthenticationFallback";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();
  
  // If no user, show loading and redirect to login
  if (!user) {
    return <AuthenticationFallback />;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-auto bg-muted/20">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
