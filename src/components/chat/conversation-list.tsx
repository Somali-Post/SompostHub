"use client";

import { Plus, Search } from "lucide-react";

const GROUPS = [
  {
    id: "logistics",
    name: "Logistics Team",
    time: "14:02",
    preview: "Ayan: The parcel tracking is updated...",
    icon: "L",
    color: "bg-navy",
    active: true,
  },
  {
    id: "delivery",
    name: "Delivery Fleet",
    time: "12:45",
    preview: "Omar: Van 4 needs maintenance...",
    icon: "D",
    color: "bg-primary",
    active: false,
  },
  {
    id: "admin",
    name: "Management",
    time: "Yesterday",
    preview: "Director: Meeting at 3 PM",
    icon: "M",
    color: "bg-accent",
    active: false,
  },
  {
    id: "security",
    name: "Security Ops",
    time: "Mon",
    preview: "Gate 2 check complete.",
    icon: "S",
    color: "bg-slate-700",
    active: false,
  },
];

export default function ConversationList() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-auth-button/50 focus:border-auth-button transition-all"
            placeholder="Search staff or groups..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Active Channels
        </div>
        <div className="space-y-1 px-2">
          {GROUPS.map((group) => (
            <div
              key={group.id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                group.active
                  ? "bg-auth-button/10 border border-auth-button/20 shadow-sm"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${group.color} flex items-center justify-center text-white font-bold shadow-sm shrink-0`}
              >
                {group.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span
                    className={`font-bold text-sm ${
                      group.active ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {group.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {group.time}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    group.active
                      ? "text-auth-button font-medium"
                      : "text-slate-500"
                  }`}
                >
                  {group.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full bg-auth-button text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-auth-buttonHover shadow-md shadow-auth-button/20 transition-all active:scale-[0.98]">
          <Plus size={18} /> Compose New
        </button>
      </div>
    </div>
  );
}
