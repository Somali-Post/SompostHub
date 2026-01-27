import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { getSession } from '@/lib/auth';

const USER_ROLES = ['ADMIN', 'OFFICE_STAFF', 'DELIVERY'] as const;
type UserRole = (typeof USER_ROLES)[number];

const MASTER_ADMINS = ['Kal', 'Abs'];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { fullName, username, role, phone, avatar } = body;

    const roleKey = String(role || '').toUpperCase();
    const roleValue = USER_ROLES.includes(roleKey as UserRole)
      ? (roleKey as UserRole)
      : null;

    if (!roleValue) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (roleValue === 'ADMIN') {
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
        role: roleValue,
        phone,
        avatar,
        pin: defaultPinHash,
        pinMustChange: true,
        jobTitle: roleValue === 'ADMIN' ? 'Administrator' : 'Staff Member',
        email: roleValue === 'ADMIN' ? `${username}@somalipost.gov.so` : undefined,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
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
