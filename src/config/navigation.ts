import {
  MessageSquare,
  CheckSquare,
  ScanBarcode,
  Box,
  Truck,
  BookOpen,
  LayoutDashboard,
  Inbox,
  Users,
  FileText,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: any;
  roles?: string[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Work",
    items: [
      { label: "Messaging", href: "/chat", icon: MessageSquare },
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
      { label: "Scan Items", href: "/scan", icon: ScanBarcode },
      { label: "Tracking", href: "/tracking", icon: Box },
      { label: "Delivery", href: "/delivery", icon: Truck },
    ],
  },
  {
    title: "Knowledge",
    items: [{ label: "Knowledge Base", href: "/knowledge", icon: BookOpen }],
  },
  {
    title: "Admin",
    items: [
      {
        label: "Ops Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN"],
      },
      { label: "Inbox", href: "/admin/inbox", icon: Inbox, roles: ["ADMIN"] },
      { label: "Staff Mgmt", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
      { label: "Audit Log", href: "/admin/audit", icon: FileText, roles: ["ADMIN"] },
      {
        label: "System Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["ADMIN"],
      },
    ],
  },
];
