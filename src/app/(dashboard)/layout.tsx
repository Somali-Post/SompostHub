import DashboardLayoutClient from "@/components/layout/dashboard-layout-client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = session;

  if (session && typeof session.id === "string") {
    try {
      const profile = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          jobTitle: true,
          avatar: true,
        },
      });

      if (profile) {
        user = profile;
      }
    } catch (error) {
      console.error("DASHBOARD USER LOAD ERROR:", error);
    }
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
