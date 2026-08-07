import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { DashboardSidebar } from "./_components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-auto bg-muted/20">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
