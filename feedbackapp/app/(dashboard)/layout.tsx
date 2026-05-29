import PendingTasksGuard from '@/components/PendingTasksGuard';
import DashboardLayoutInner from './DashboardLayoutInner';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PendingTasksGuard>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </PendingTasksGuard>
  );
}
