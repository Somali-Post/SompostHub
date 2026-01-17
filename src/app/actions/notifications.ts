'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  const session = await getSession();
  if (!session) return [];

  return await prisma.notification.findMany({
    where: {
      OR: [{ userId: null }, { userId: session.id }],
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
  if (!session) return;

  await prisma.notification.deleteMany({
    where: { userId: session.id },
  });
  revalidatePath('/notifications');
}
