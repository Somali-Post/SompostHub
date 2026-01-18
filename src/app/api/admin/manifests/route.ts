import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bags = await prisma.receptacle.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originImpc: true,
        destImpc: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            barcode: true,
          },
        },
      },
    });

    return NextResponse.json(bags);
  } catch (error) {
    console.error('MANIFESTS FETCH ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
