import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { parseS9 } from '@/lib/s9';
import { parseS10 } from '@/lib/upu';
import { randomUUID } from 'crypto';
import { ReceptacleStatus, ScanType } from '@prisma/client';

type CaptureInput = {
  type?: string;
  img?: string;
};

const toScanType = (value: string | null | undefined, fallback: ScanType) => {
  const normalized = (value || '').toUpperCase();
  return normalized in ScanType
    ? (ScanType[normalized as keyof typeof ScanType] as ScanType)
    : fallback;
};

const normalizeImageUrl = (value: string) => {
  if (value.startsWith('data:')) return value;
  return `data:image/jpeg;base64,${value}`;
};

const fileToDataUrl = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || 'image/jpeg';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

const collectIndexedFields = (formData: FormData, keyName: string) => {
  const values: Record<number, string> = {};
  for (const [key, value] of formData.entries()) {
    const match = key.match(new RegExp(`^${keyName}\\[(\\d+)\\]$`));
    if (!match) continue;
    const index = Number(match[1]);
    if (!Number.isNaN(index)) {
      values[index] = String(value);
    }
  }
  return values;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const scannerId = session && typeof session.id === 'string' ? session.id : null;
    if (!scannerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files = formData.getAll('images');
      if (files.length === 0) {
        return NextResponse.json({ error: 'No images provided' }, { status: 400 });
      }

      const indexedTypes = collectIndexedFields(formData, 'types');
      const directTypes = formData.getAll('types').map((value) => String(value));

      const captures = await Promise.all(
        files.map(async (entry, index) => {
          const captureType =
            directTypes[index] || indexedTypes[index] || indexedTypes[Number(index)] || 'ITEM';
          if (typeof entry === 'string') {
            return {
              type: toScanType(captureType, ScanType.ITEM),
              imageUrl: normalizeImageUrl(entry),
            };
          }

          return {
            type: toScanType(captureType, ScanType.ITEM),
            imageUrl: await fileToDataUrl(entry),
          };
        })
      );

      const scanData = captures.map((capture) => ({
        barcode: `IMG-${randomUUID()}`,
        weight: 0,
        type: capture.type,
        origin: 'UNKNOWN',
        scannerId,
        imageUrl: capture.imageUrl,
      }));

      const result = await prisma.scan.createMany({ data: scanData });
      return NextResponse.json({ success: true, count: result.count });
    }

    const body = await req.json();

    const rawCaptures = Array.isArray(body?.captures) ? (body.captures as CaptureInput[]) : null;
    const rawImages = Array.isArray(body?.images) ? body.images : null;

    if (rawCaptures || rawImages) {
      const captures: CaptureInput[] = rawCaptures
        ? rawCaptures
        : rawImages!.map((item: unknown) =>
            typeof item === 'string' ? { img: item } : (item as CaptureInput)
          );
      if (captures.length === 0) {
        return NextResponse.json({ error: 'No captures provided' }, { status: 400 });
      }

      const scanData = captures.map((capture, index) => {
        if (!capture?.img || typeof capture.img !== 'string') {
          throw new Error(`Invalid capture at index ${index}`);
        }

        return {
          barcode: `IMG-${randomUUID()}`,
          weight: 0,
          type: toScanType(capture.type, ScanType.ITEM),
          origin: 'UNKNOWN',
          scannerId,
          imageUrl: normalizeImageUrl(capture.img),
        };
      });

      const result = await prisma.scan.createMany({ data: scanData });
      return NextResponse.json({ success: true, count: result.count });
    }

    if (Array.isArray(body?.bags)) {
      const bags = body.bags as Array<{
        id: string;
        items: Array<{ barcode: string }>;
      }>;

      if (bags.length === 0) {
        return NextResponse.json({ error: 'No bags to submit' }, { status: 400 });
      }

      const result = await prisma.$transaction(async (tx) => {
        let scanCount = 0;

        for (const bag of bags) {
          const s9 = parseS9(String(bag.id || '').toUpperCase().trim());
          if (!s9.isValid) {
            throw new Error(`Invalid receptacle ID: ${bag.id}`);
          }

          if (!Array.isArray(bag.items) || bag.items.length === 0) {
            throw new Error(`No items for receptacle ${s9.id}`);
          }

          await tx.receptacle.create({
            data: {
              id: s9.id,
              originImpc: s9.origin,
              destImpc: s9.destination,
              weight: s9.weightKg,
              status: ReceptacleStatus.CLOSED,
              scannedById: scannerId,
            },
          });

          const scanData = bag.items.map((item) => {
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

          const scans = await tx.scan.createMany({ data: scanData });
          scanCount += scans.count;
        }

        return scanCount;
      });

      return NextResponse.json({ success: true, count: result });
    }

    return NextResponse.json({ error: 'Unsupported payload' }, { status: 400 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Receptacle already exists' }, { status: 409 });
    }
    if (error instanceof Error) {
      const message = error.message;
      if (message.startsWith('Invalid') || message.startsWith('No items')) {
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }
    console.error('SCAN SESSION ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
