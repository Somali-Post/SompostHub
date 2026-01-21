'use server';

import { prisma } from '@/lib/prisma';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getTasks() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  return await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: { assignedTo: true },
  });
}

export async function createTask(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const priorityInput = (formData.get('priority') as string) || 'MEDIUM';
  const priorityKey = priorityInput.toUpperCase();
  const priority =
    priorityKey in TaskPriority
      ? (TaskPriority[priorityKey as keyof typeof TaskPriority] as TaskPriority)
      : TaskPriority.MEDIUM;

  if (!title) return;

  await prisma.task.create({
    data: {
      title,
      priority,
      status: TaskStatus.PENDING,
      dueDate: new Date(),
    },
  });

  revalidatePath('/tasks');
}

export async function toggleTask(id: string, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
  await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
  revalidatePath('/tasks');
}
