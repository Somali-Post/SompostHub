'use client';

import { useState } from 'react';
import { Mail, AlertTriangle, Users, Search, Filter, Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function AdminInboxPage() {
  const [activeTab, setActiveTab] = useState('enquiries');
  return (
    <div className="flex h-full w-full bg-white border-t border-slate-200 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`pb-4 border-b-2 font-bold text-sm ${
                activeTab === 'enquiries' ? 'border-auth-button text-auth-button' : 'border-transparent text-slate-500'
              }`}
            >
              Enquiries
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-4 border-b-2 font-bold text-sm ${
                activeTab === 'alerts' ? 'border-auth-button text-auth-button' : 'border-transparent text-slate-500'
              }`}
            >
              Alerts
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-center text-slate-400">
          <p>Inbox loaded. No new items.</p>
        </div>
      </div>
    </div>
  );
}
