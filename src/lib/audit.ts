import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function logAction(action: string, details: string) {
  try {
    const session = await getSession();
    const actorId = session?.id ? String(session.id) : 'system';
    const actorName = session?.name ? String(session.name) : 'System';
    const actorRole = session?.role ? String(session.role) : 'SYSTEM';

    await prisma.auditLog.create({
      data: { action, details, actorId, actorName, actorRole },
    });
  } catch (error) {
    console.error('Failed to write audit log', error);
  }
}
