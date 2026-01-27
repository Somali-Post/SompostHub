'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

type InboxMessageRow = {
  id: string;
  content: string | null;
  createdAt: Date;
  sender: {
    fullName: string;
    role: string;
  };
};

export async function getInboxMessages() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return [];

  const messages = (await prisma.message.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { fullName: true, role: true } },
    },
  })) as InboxMessageRow[];

  return messages.map((msg) => {
    const content = msg.content ?? '';
    return {
      id: msg.id,
      sender: msg.sender.fullName,
      role: msg.sender.role,
      subject: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      fullContent: content,
      time: new Date(msg.createdAt).toLocaleString(),
      isUnread: false,
    };
  });
}
