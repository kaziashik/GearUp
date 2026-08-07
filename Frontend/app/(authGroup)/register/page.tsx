import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterForm } from "../_components/AuthForms";
import { Role } from "@/lib/types";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const defaultRole = params.role === "PROVIDER" ? ("PROVIDER" as Role) : ("CUSTOMER" as Role);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          <RegisterForm defaultRole={defaultRole} />
        </GoogleOAuthProvider>
      ) : (
        <RegisterForm defaultRole={defaultRole} />
      )}
    </div>
  );
}
