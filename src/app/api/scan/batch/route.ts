import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SCAN_TYPES = ["EMS", "PARCEL", "REGISTERED", "UNKNOWN", "BAG", "ITEM"] as const;
type ScanType = (typeof SCAN_TYPES)[number];

const toScanType = (value: string | null | undefined, fallback: ScanType) => {
  const normalized = (value || "").toUpperCase();
  return SCAN_TYPES.includes(normalized as ScanType)
    ? (normalized as ScanType)
    : fallback;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const scannerId = session && typeof session.id === "string" ? session.id : null;
    if (!scannerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items to submit" }, { status: 400 });
    }

    const scanData = items.map((item: any) => ({
      barcode: item.barcode,
      weight: parseFloat(item.weight),
      type: toScanType(item.type, "UNKNOWN"),
      origin: item.origin,
      scannerId,
    }));

    const result = await prisma.scan.createMany({
      data: scanData,
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("BATCH SCAN ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
