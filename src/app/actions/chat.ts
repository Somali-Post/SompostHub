'use server';

import { prisma } from '@/lib/prisma';
import { ConversationType, MessageType } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getConversations() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

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
    const isGroup = convo.type === ConversationType.GROUP;
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
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

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
  if (!session) throw new Error('Unauthorized');

  const normalizedType = type.toUpperCase();
  const messageType =
    normalizedType in MessageType ? (MessageType[normalizedType as keyof typeof MessageType] as MessageType) : MessageType.TEXT;

  await prisma.message.create({
    data: {
      content,
      type: messageType,
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
  if (!session) throw new Error('Unauthorized');
  if (session.role !== 'ADMIN') throw new Error('Unauthorized');

  const allMembers = [...memberIds, session.id as string];

  await prisma.conversation.create({
    data: {
      type: ConversationType.GROUP,
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
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  return await prisma.user.findMany({
    select: { id: true, fullName: true, jobTitle: true, avatar: true, role: true },
  });
}

export async function createDirectChat(targetUserId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const existing = await prisma.conversation.findFirst({
    where: {
      type: ConversationType.DIRECT,
      AND: [
        { participants: { some: { userId: session.id as string } } },
        { participants: { some: { userId: targetUserId } } },
      ],
    },
  });

  if (existing) return existing.id;

  const newChat = await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      participants: {
        create: [{ userId: session.id as string }, { userId: targetUserId }],
      },
    },
  });

  return newChat.id;
}

export async function getGroupDetails(conversationId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: { user: true },
      },
    },
  });

  return {
    ...convo,
    isCurrentUserAdmin: session.role === 'ADMIN',
  };
}

export async function removeParticipant(conversationId: string, userIdToRemove: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  if (session.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.participant.deleteMany({
    where: {
      conversationId,
      userId: userIdToRemove,
    },
  });

  revalidatePath('/chat');
  return { success: true };
}
