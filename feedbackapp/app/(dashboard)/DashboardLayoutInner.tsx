'use client';

import { TopBar } from "@/components/TopBar";

interface DashboardLayoutInnerProps {
  children: React.ReactNode;
  pendingReviewsCount: number;
}

export default function DashboardLayoutInner({
  children,
  pendingReviewsCount,
}: DashboardLayoutInnerProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TopBar pendingReviewsCount={pendingReviewsCount} />

      <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden py-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,2.5rem)]">
        <div className="w-full max-w-[1100px]">
          {children}
        </div>
      </main>
    </div>
  );
}
