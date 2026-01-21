'use server';

import { prisma } from '@/lib/prisma';
import { ScanStatus } from '@prisma/client';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function confirmDelivery(barcode: string, recipientName: string) {
  const item = await prisma.scan.findFirst({
    where: { barcode },
    orderBy: { createdAt: 'desc' },
  });

  if (!item) {
    throw new Error('Item not found in system.');
  }

  await prisma.scan.update({
    where: { id: item.id },
    data: {
      status: ScanStatus.DELIVERED,
      deliveredTo: recipientName,
    },
  });

  await logAction('DELIVERY_CONFIRM', `Marked ${barcode} as delivered to ${recipientName}`);

  revalidatePath('/tracking');
}
