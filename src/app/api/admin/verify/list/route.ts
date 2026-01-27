import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const sessions = await prisma.verificationSession.findMany({
    where: { status: 'PENDING' },
    include: {
      submitter: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(sessions);
}
