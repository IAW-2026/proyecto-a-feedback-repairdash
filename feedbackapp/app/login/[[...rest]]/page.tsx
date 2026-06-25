import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Header fuera del card de Clerk */}
        <div className="w-full text-center mb-8">
          <div className="text-xs uppercase tracking-widest text-brand-accent-mid font-semibold mb-2">
            Feedback App
          </div>
          <h1 className="text-4xl font-bold text-brand-text-light mb-3">
            RepairDash
          </h1>
          <p className="text-brand-accent-mid">Iniciá sesión en tu cuenta</p>
        </div>

        {/* Card de Clerk con alto contraste */}
        <SignIn
          routing="path"
          path="/login"
          fallbackRedirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: "var(--brand-accent-strong)",
              colorBackground: "#ffffff",
              colorInputBackground: "#f3f0f6",
              colorInputText: "var(--brand-bg)",
              colorText: "var(--brand-bg)",
              colorTextSecondary: "var(--brand-accent-soft)",
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
                color: "var(--brand-bg)",
                fontSize: "0.875rem",
              },
              formButtonPrimary: {
                backgroundColor: "var(--brand-accent-strong)",
                borderRadius: "0.5rem",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "var(--brand-accent-strong-hover)",
                },
              },
              dividerLine: {
                backgroundColor: "#e5d9f0",
              },
              dividerText: {
                color: "#ad86c7",
              },
              socialButtonsBlockButton: {
                borderRadius: "0.5rem",
                borderColor: "#e5d9f0",
                color: "var(--brand-bg)",
              },
              socialButtonsBlockButtonText: {
                color: "var(--brand-bg)",
              },
            },
          }}
        />
      </div>
    </div>
  );
}