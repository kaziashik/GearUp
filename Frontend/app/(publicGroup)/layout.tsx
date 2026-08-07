import { getMe } from "@/service/getMe";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
