import DashboardLayoutClient from "@/components/layout/dashboard-layout-client";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return <DashboardLayoutClient user={session}>{children}</DashboardLayoutClient>;
}
