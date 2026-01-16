import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { compare, hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters and include 1 uppercase, 1 number, and 1 special character.',
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: session.id as string } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or has no password set' }, { status: 404 });
    }

    const isValid = await compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect old password' }, { status: 401 });
    }

    const newHash = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
