'use client';

import { Search, Download, Shield, Key, Box, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditLogPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8 gap-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
        <button
          onClick={() => toast.message('Exporting...')}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50"
        >
          <Download size={16} /> Export
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-3 font-mono text-xs">10:42 AM</td>
              <td className="px-6 py-3 font-bold">Said Ahmed</td>
              <td className="px-6 py-3">PIN_RESET</td>
              <td className="px-6 py-3 text-right text-green-600 font-bold">SUCCESS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
