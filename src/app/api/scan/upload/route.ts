import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { VerificationImageType, VerificationSessionStatus } from '@prisma/client';

const toVerificationImageType = (value: string | null | undefined) => {
  const normalized = (value || '').toUpperCase();
  return normalized in VerificationImageType
    ? (VerificationImageType[normalized as keyof typeof VerificationImageType] as VerificationImageType)
    : VerificationImageType.ITEM;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const images = Array.isArray(body?.images) ? body.images : [];

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const newSession = await prisma.verificationSession.create({
      data: {
        submitterId: session.id as string,
        status: VerificationSessionStatus.PENDING,
        images: {
          create: images.map((img: any) => ({
            type: toVerificationImageType(img?.type),
            base64: String(img?.img || ''),
          })),
        },
      },
    });

    return NextResponse.json({ success: true, id: newSession.id });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
