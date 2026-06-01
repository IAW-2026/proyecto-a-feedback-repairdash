'use client';

import { TopBar } from "@/components/TopBar";

export default function DashboardLayoutInner({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TopBar />

      <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden py-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,2.5rem)]">
        <div className="w-full max-w-[1100px]">
          {children}
        </div>
      </main>
    </div>
  );
}
