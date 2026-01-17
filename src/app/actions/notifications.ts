'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  const session = await getSession();
  const userId = session?.id as string | undefined;
  if (!userId) return [];

  return await prisma.notification.findMany({
    where: {
      OR: [{ userId: null }, { userId }],
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAsRead(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath('/notifications');
}

export async function clearAllNotifications() {
  const session = await getSession();
  const userId = session?.id as string | undefined;
  if (!userId) return;

  await prisma.notification.deleteMany({
    where: { userId },
  });
  revalidatePath('/notifications');
}
