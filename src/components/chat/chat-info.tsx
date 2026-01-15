"use client";

import { ChevronRight } from "lucide-react";

export default function ChatInfo() {
  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto bg-auth-sidebarFrom rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3">
          L
        </div>
        <h3 className="font-bold text-slate-900">Logistics Team</h3>
        <p className="text-xs text-slate-500">Managed by Ops</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">
            Description
          </h4>
          <p className="text-xs text-slate-600">
            Official channel for coordination between regional hubs and last-mile
            delivery.
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] font-bold uppercase text-slate-400">
              Members (48)
            </h4>
            <span className="text-[10px] text-auth-button font-bold cursor-pointer">
              View All
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <div className="w-6 h-6 rounded-full bg-slate-300" />
              Fartun Jama
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <div className="w-6 h-6 rounded-full bg-slate-300" />
              Ayan Barre
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
