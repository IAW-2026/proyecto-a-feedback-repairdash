export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse px-4 py-6">
      <div className="h-8 w-48 bg-[#3a1f52] rounded-lg" />
      <div className="h-4 w-72 bg-[#3a1f52] rounded-lg" />
      <div className="h-4 w-96 bg-[#3a1f52] rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#3a1f52] rounded-xl p-6 space-y-4 border border-brand-accent-soft/20">
            <div className="h-12 w-12 bg-brand-accent-soft/30 rounded-lg" />
            <div className="h-5 w-32 bg-brand-accent-soft/30 rounded" />
            <div className="h-4 w-full bg-brand-accent-soft/30 rounded" />
            <div className="h-4 w-2/3 bg-brand-accent-soft/30 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-[#3a1f52] rounded-xl p-6 space-y-4 border border-brand-accent-soft/20">
        <div className="h-5 w-40 bg-brand-accent-soft/30 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-brand-accent-soft/10 last:border-0">
            <div className="h-10 w-10 rounded-full bg-brand-accent-soft/30" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-brand-accent-soft/30 rounded" />
              <div className="h-3 w-32 bg-brand-accent-soft/30 rounded" />
            </div>
            <div className="h-6 w-20 bg-brand-accent-soft/30 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
