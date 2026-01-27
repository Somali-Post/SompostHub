import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalVolume, totalStaff, pendingTasks, weightAgg, recentScans] =
      await Promise.all([
        prisma.scan.count(),
        prisma.user.count({ where: { role: { not: "ADMIN" } } }),
        prisma.task.count({ where: { status: "PENDING" } }),
        prisma.scan.aggregate({ _sum: { weight: true } }),
        prisma.scan.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            barcode: true,
            createdAt: true,
            scanner: {
              select: {
                id: true,
                fullName: true,
                username: true,
              },
            },
          },
        }),
      ]);

    const totalWeight = weightAgg._sum.weight ?? 0;

    return NextResponse.json({
      volume: totalVolume,
      weight: totalWeight.toFixed(2),
      staff: totalStaff,
      issues: pendingTasks,
      recentActivity: recentScans,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
