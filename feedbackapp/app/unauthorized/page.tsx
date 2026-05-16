export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="max-w-md rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">No tenes permisos</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Tu cuenta no tiene acceso al panel.
        </p>
      </div>
    </div>
  );
}
