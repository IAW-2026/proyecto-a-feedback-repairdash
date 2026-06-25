import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import UserRegistrationGuard from '@/components/UserRegistrationGuard';
import PendingTasksGuard from '@/components/PendingTasksGuard';
import DashboardLayoutInner from './DashboardLayoutInner';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  let pendingReviewsCount = 0;
  if (user) {
    pendingReviewsCount = await prisma.review.count({
      where: {
        idUsuario: user.id,
        estaCompleta: false,
      },
    });
  }

  return (
    <UserRegistrationGuard>
      <PendingTasksGuard>
        <DashboardLayoutInner pendingReviewsCount={pendingReviewsCount}>
          {children}
        </DashboardLayoutInner>
      </PendingTasksGuard>
    </UserRegistrationGuard>
  );
}
