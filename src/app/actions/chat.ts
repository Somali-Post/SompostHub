'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getConversations() {
  const session = await getSession();
  if (!session) return [];

  const convos = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId: session.id as string } },
    },
    include: {
      participants: { include: { user: true } },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return convos.map((convo) => {
    const isGroup = convo.type === 'GROUP';
    const otherParticipant = convo.participants.find(
      (participant) => participant.userId !== session.id
    )?.user;

    return {
      id: convo.id,
      type: convo.type,
      name: isGroup ? convo.name : otherParticipant?.fullName,
      jobTitle: isGroup ? null : otherParticipant?.jobTitle,
      avatar: isGroup ? convo.avatar : otherParticipant?.avatar,
      lastMessage:
        convo.messages[0]?.content || (convo.messages[0]?.fileUrl ? 'Attachment' : 'No messages'),
      time: convo.messages[0]?.createdAt,
      participants: convo.participants,
    };
  });
}

export async function getMessages(conversationId: string) {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
  });
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: string = 'TEXT',
  fileUrl?: string
) {
  const session = await getSession();
  if (!session) return;

  await prisma.message.create({
    data: {
      content,
      type,
      fileUrl,
      conversationId,
      senderId: session.id as string,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/chat');
}

export async function createGroup(name: string, memberIds: string[]) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

  const allMembers = [...memberIds, session.id as string];

  await prisma.conversation.create({
    data: {
      type: 'GROUP',
      name,
      participants: {
        create: allMembers.map((id) => ({ userId: id })),
      },
    },
  });

  revalidatePath('/chat');
  return { success: true };
}

export async function getAllStaff() {
  return await prisma.user.findMany({
    select: { id: true, fullName: true, jobTitle: true, avatar: true, role: true },
  });
}

export async function createDirectChat(targetUserId: string) {
  const session = await getSession();
  if (!session) return;

  const existing = await prisma.conversation.findFirst({
    where: {
      type: 'DIRECT',
      AND: [
        { participants: { some: { userId: session.id as string } } },
        { participants: { some: { userId: targetUserId } } },
      ],
    },
  });

  if (existing) return existing.id;

  const newChat = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      participants: {
        create: [{ userId: session.id as string }, { userId: targetUserId }],
      },
    },
  });

  return newChat.id;
}

export async function removeParticipant(conversationId: string, userIdToRemove: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.participant.deleteMany({
    where: {
      conversationId,
      userId: userIdToRemove,
    },
  });

  revalidatePath('/chat');
  return { success: true };
}
