'use client';

import { useState } from 'react';
import { AlertTriangle, Check, FileText, Info, Trash2 } from 'lucide-react';

type TabButtonProps = {
  id: string;
  label: string;
  count?: number;
  active: string;
  onClick: (id: string) => void;
};

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 md:p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notification Center</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your alerts and system updates.</p>
        </div>
        <button
          onClick={() => alert('Feature coming soon')}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
        <TabButton
          id="all"
          label="All Notifications"
          count={12}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          id="unread"
          label="Unread"
          count={3}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton id="alerts" label="System Alerts" active={activeTab} onClick={setActiveTab} />
        <TabButton id="tasks" label="Tasks" active={activeTab} onClick={setActiveTab} />
      </div>

      <div className="max-w-4xl space-y-4">
        <div className="group flex gap-4 rounded-xl border-l-4 border-red-500 border-y border-r border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h4 className="font-bold text-slate-900">System Error: Scanner ID-402</h4>
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                Urgent
              </span>
            </div>
            <p className="text-sm text-slate-600">
              The high-capacity scanner in the central sorting facility is unresponsive. Immediate
              maintenance required.
            </p>
            <span className="mt-2 inline-block text-[11px] font-bold uppercase text-slate-400">
              2 hours ago
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => alert('Feature coming soon')}
              className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-primary"
              title="Mark as Read"
            >
              <Check size={18} />
            </button>
          </div>
        </div>

        <div className="group flex gap-4 rounded-xl border-l-4 border-amber-400 border-y border-r border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h4 className="font-bold text-slate-900">Pending Customs Review: Batch #SO-9921</h4>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Action Required
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Incoming international shipment requires validation of declaration forms.
            </p>
            <span className="mt-2 inline-block text-[11px] font-bold uppercase text-slate-400">
              4 hours ago
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => alert('Feature coming soon')}
              className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-primary"
              title="Mark as Read"
            >
              <Check size={18} />
            </button>
          </div>
        </div>

        <div className="group flex gap-4 rounded-xl border-l-4 border-slate-300 border-y border-r border-slate-200 bg-white p-5 opacity-75 shadow-sm transition-all hover:opacity-100 hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Info size={24} />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h4 className="font-bold text-slate-900">New Policy Document Uploaded</h4>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Info
              </span>
            </div>
            <p className="text-sm text-slate-600">
              The updated Q3 2024 Domestic Mail Handling protocol is now available.
            </p>
            <span className="mt-2 inline-block text-[11px] font-bold uppercase text-slate-400">
              Yesterday
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ id, label, count, active, onClick }: TabButtonProps) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
        isActive
          ? 'border-auth-button text-auth-button'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {label} {typeof count === 'number' ? `(${count})` : ''}
    </button>
  );
}
