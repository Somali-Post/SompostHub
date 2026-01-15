import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-auth-button text-white flex items-center justify-center font-bold">
          H
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">Staff Hub</div>
          <div className="text-xs text-slate-400">Operations Dashboard</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-500">
          <Search size={16} />
          <span className="text-xs">Search</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-auth-button">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
