import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import UnregisteredUserScreen from './UnregisteredUserScreen';

export default async function UserRegistrationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) {
      return <UnregisteredUserScreen />;
    }
  }

  return <>{children}</>;
}
