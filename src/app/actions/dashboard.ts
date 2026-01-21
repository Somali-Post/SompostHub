'use server';

import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function getDashboardStats() {
  const totalVolume = await prisma.scan.count();
  const totalStaff = await prisma.user.count({ where: { role: { not: 'ADMIN' } } });
  const pendingTasks = await prisma.task.count({ where: { status: TaskStatus.PENDING } });

  const weightAgg = await prisma.scan.aggregate({
    _sum: { weight: true },
  });
  const totalWeight = weightAgg._sum.weight || 0;

  const recentScans = await prisma.scan.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { scanner: true },
  });

  return {
    volume: totalVolume,
    weight: totalWeight.toFixed(2),
    staff: totalStaff,
    issues: pendingTasks,
    recentActivity: recentScans,
  };
}
