import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Feedback App</h1>
          <p className="mt-2 text-gray-600">Iniciá sesión en tu cuenta</p>
        </div>

        <SignIn
          routing="path"
          path="/login"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              footerAction: { display: "none" },
            },
          }}
        />
      </div>
    </div>
  );
}