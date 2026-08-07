import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginForm } from "../_components/AuthForms";

export default function LoginPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          <LoginForm />
        </GoogleOAuthProvider>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
