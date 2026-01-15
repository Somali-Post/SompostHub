import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const isStaffLogin = !!body.pin;
    const isAdminLogin = !!body.password || !!body.adminPassword;

    let user = null;

    if (isStaffLogin) {
      console.log(`Attempting Staff Login for: ${body.username}`);
      user = await prisma.user.findUnique({
        where: { username: body.username },
      });

      if (!user) {
        console.log("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      if (!user.pin) {
        console.log("User has no PIN set");
        return NextResponse.json(
          { error: "Account setup incomplete" },
          { status: 401 }
        );
      }

      const pinValid = await compare(body.pin, user.pin);
      if (!pinValid) {
        console.log("Invalid PIN");
        return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
      }
    } else if (isAdminLogin) {
      const email = body.adminEmail || body.email;
      const password = body.adminPassword || body.password;

      console.log(`Attempting Admin Login for: ${email}`);
      user = await prisma.user.findUnique({ where: { email } });

      if (!user || !user.password || !(await compare(password, user.password))) {
        console.log("Invalid Admin Credentials");
        return NextResponse.json(
          { error: "Invalid Email or Password" },
          { status: 401 }
        );
      }

      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid Request Data" },
        { status: 400 }
      );
    }

    const token = await signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.fullName,
    });

    const cookieStore = await cookies();

    cookieStore.set("sp_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      redirect: user.role === "ADMIN" ? "/admin/dashboard" : "/chat",
    });
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
