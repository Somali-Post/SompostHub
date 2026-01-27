import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const USER_ROLES = ['ADMIN', 'OFFICE_STAFF', 'DELIVERY'] as const;
type UserRole = (typeof USER_ROLES)[number];

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, fullName, username, role, phone, jobTitle } = body || {};

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const roleKey = role ? String(role).toUpperCase() : '';
    const roleValue =
      roleKey && USER_ROLES.includes(roleKey as UserRole)
        ? (roleKey as UserRole)
        : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        username,
        role: roleValue,
        phone,
        jobTitle,
        email: roleValue === 'ADMIN' ? `${username}@somalipost.gov.so` : undefined,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('UPDATE USER ERROR:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
