"use client";

import {
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
} from "lucide-react";

export default function TasksPage() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Tasks & Calendar
            </h1>
            <p className="text-slate-500 text-sm">
              Manage daily postal duties and staff scheduling.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => alert('Feature coming soon')}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50"
            >
              <Filter size={16} /> Filter
            </button>
            <button
              onClick={() => alert('Feature coming soon')}
              className="flex h-9 items-center gap-2 rounded-lg bg-auth-button px-3 text-sm font-semibold text-white hover:bg-auth-buttonHover shadow-sm"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-[400px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => alert('Feature coming soon')}
                  className="flex-1 py-1 text-xs font-bold rounded bg-white shadow-sm text-slate-900"
                >
                  My Tasks
                </button>
                <button
                  onClick={() => alert('Feature coming soon')}
                  className="flex-1 py-1 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Team Tasks
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-auth-button/50 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-auth-button focus:ring-auth-button"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        Sort incoming mail (Batch #402)
                      </h4>
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        HIGH
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      Ensure customs clearance forms are attached.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Clock size={12} /> Today, 2:00 PM
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-auth-button/50 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-auth-button focus:ring-auth-button"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        Update dispatch logs
                      </h4>
                      <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        MED
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                      <Clock size={12} /> Oct 25, 10:00 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">October 2023</h3>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <MoreHorizontal size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="bg-slate-50 p-2 text-center text-xs font-bold text-slate-500"
                  >
                    {d}
                  </div>
                ))}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white min-h-[80px] p-2 relative hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-400">
                      {i + 1}
                    </span>
                    {i === 10 && (
                      <div className="mt-1 bg-auth-button text-white text-[10px] font-bold px-1 rounded truncate">
                        Staff Meeting
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
