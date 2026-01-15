import {
  Barcode,
  CalendarDays,
  MessageSquare,
  Package,
  Truck,
  UserCircle,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Operations",
    items: [
      { href: "/chat", label: "Chat", icon: MessageSquare },
      { href: "/scan", label: "Scan", icon: Barcode },
      { href: "/tasks", label: "Tasks", icon: CalendarDays },
    ],
  },
  {
    title: "Logistics",
    items: [
      { href: "/tracking", label: "Tracking", icon: Package },
      { href: "/delivery", label: "Delivery", icon: Truck },
    ],
  },
  {
    title: "Account",
    items: [{ href: "/profile", label: "Profile", icon: UserCircle }],
  },
];
