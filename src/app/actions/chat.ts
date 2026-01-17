'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getMessages() {
  const messages = await prisma.message.findMany({
    take: 50,
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { fullName: true, id: true } } },
  });

  return messages.map((msg) => ({
    id: msg.id,
    text: msg.content,
    sender: msg.sender.fullName,
    senderId: msg.sender.id,
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export async function sendMessage(content: string) {
  const session = await getSession();
  const senderId = session?.id as string | undefined;
  if (!senderId) return;

  await prisma.message.create({
    data: {
      content,
      senderId,
      channel: 'logistics',
    },
  });
}
