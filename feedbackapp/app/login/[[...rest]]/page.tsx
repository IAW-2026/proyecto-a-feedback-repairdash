import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-md">
        {/* Header fuera del card de Clerk */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Feedback App</h1>
          <p className="text-brand-accent-mid">Iniciá sesión en tu cuenta</p>
        </div>

        {/* Card de Clerk con alto contraste */}
        <SignIn
          routing="path"
          path="/login"
          fallbackRedirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: "#f500f1",
              colorBackground: "#ffffff",
              colorInputBackground: "#f3f0f6",
              colorInputText: "#271033",
              colorText: "#271033",
              colorTextSecondary: "#8d62a5",
              borderRadius: "1rem",
            },
            elements: {
              footerAction: { display: "none" },
              card: {
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                borderRadius: "1rem",
              },
              formFieldInput: {
                borderRadius: "0.5rem",
                backgroundColor: "#f3f0f6",
                borderColor: "#e5d9f0",
              },
              formFieldLabel: {
                color: "#271033",
                fontSize: "0.875rem",
              },
              formButtonPrimary: {
                backgroundColor: "#f500f1",
                borderRadius: "0.5rem",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "#d400c9",
                },
              },
              dividerLine: {
                backgroundColor: "#e5d9f0",
              },
              dividerText: {
                color: "#8d62a5",
              },
              socialButtonsBlockButton: {
                borderRadius: "0.5rem",
                borderColor: "#e5d9f0",
                color: "#271033",
              },
              socialButtonsBlockButtonText: {
                color: "#271033",
              },
            },
          }}
        />
      </div>
    </div>
  );
}