import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { getSession } from '@/lib/auth';

const MASTER_ADMINS = ['Kal', 'Abs'];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { fullName, username, role, phone } = body;

    if (role === 'ADMIN') {
      if (!MASTER_ADMINS.includes(session.username as string)) {
        return NextResponse.json(
          {
            error:
              'Permission Denied. Only Master Admins (Kal/Abs) can create new Administrators.',
          },
          { status: 403 }
        );
      }
    }

    if (!fullName || !username || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const defaultPinHash = await hash('0000', 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        role,
        phone,
        pin: defaultPinHash,
        pinMustChange: true,
        jobTitle: role === 'ADMIN' ? 'Administrator' : 'Staff Member',
        email: role === 'ADMIN' ? `${username}@somalipost.gov.so` : undefined,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('CREATE USER ERROR:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
