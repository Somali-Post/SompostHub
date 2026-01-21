import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { parseS9 } from '@/lib/s9';
import { parseS10 } from '@/lib/upu';
import { ReceptacleStatus, ScanType } from '@prisma/client';

const toScanType = (value: string | null | undefined, fallback: ScanType) => {
  const normalized = (value || '').toUpperCase();
  return normalized in ScanType
    ? (ScanType[normalized as keyof typeof ScanType] as ScanType)
    : fallback;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const scannerId = session && typeof session.id === 'string' ? session.id : null;
    if (!scannerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { receptacle, items } = body || {};

    if (!receptacle || typeof receptacle.id !== 'string') {
      return NextResponse.json({ error: 'Missing receptacle' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items to submit' }, { status: 400 });
    }

    const s9 = parseS9(receptacle.id);
    if (!s9.isValid) {
      return NextResponse.json({ error: 'Invalid receptacle ID' }, { status: 400 });
    }

    const scanData = items.map((item: any) => {
      const barcode = String(item.barcode || '').toUpperCase().trim();
      const parsed = parseS10(barcode);
      return {
        barcode,
        weight: 0,
        type: toScanType(parsed.type, ScanType.UNKNOWN),
        origin: parsed.countryName || 'UNKNOWN',
        scannerId,
        receptacleId: s9.id,
      };
    });

    const result = await prisma.$transaction(async (tx) => {
      const bag = await tx.receptacle.create({
        data: {
          id: s9.id,
          originImpc: s9.origin,
          destImpc: s9.destination,
          weight: s9.weightKg,
          status: ReceptacleStatus.CLOSED,
          scannedById: scannerId,
        },
      });

      const scans = await tx.scan.createMany({
        data: scanData,
      });

      return { bag, scans };
    });

    return NextResponse.json({ success: true, count: result.scans.count });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Receptacle already exists' }, { status: 409 });
    }
    console.error('RECEPTACLE SCAN ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
