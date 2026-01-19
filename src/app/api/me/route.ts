import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        jobTitle: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.id as string },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        jobTitle: data.jobTitle,
        avatar: data.avatar,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        jobTitle: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
