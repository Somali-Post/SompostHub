import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
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
      type: item.type,
      origin: item.origin,
      scannerId: session.id,
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
