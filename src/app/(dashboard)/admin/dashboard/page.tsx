'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Package, Users, CheckCircle } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/skeletons';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Operational Command</h1>
          <p className="text-slate-500">Real-time status overview.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert('Exporting Audit Log to CSV...')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Export Audit
          </button>
          <button
            onClick={() => {
              window.location.href = '/scan';
            }}
            className="px-4 py-2 bg-auth-sidebarFrom text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800"
          >
            Manifest Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Volume"
              value="14,822"
              unit="pcs"
              icon={<Package className="text-auth-button" />}
            />
            <StatCard
              title="Total Weight"
              value="4.2"
              unit="Tons"
              icon={<TrendingUp className="text-amber-500" />}
            />
            <StatCard
              title="Active Staff"
              value="104"
              unit="Online"
              icon={<Users className="text-blue-500" />}
            />
            <StatCard
              title="System Health"
              value="99.9%"
              unit="Uptime"
              icon={<CheckCircle className="text-green-500" />}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Processing Trends</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-sm text-slate-400 font-medium">Chart Data Loading...</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Staff Performance</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Staff Member</th>
                    <th className="px-6 py-3">Scanned</th>
                    <th className="px-6 py-3">Efficiency</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No activity recorded today.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Action Required</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No pending alerts.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-auth-button hover:text-auth-button transition-colors">
                New Staff
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-auth-button hover:text-auth-button transition-colors">
                System Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black mt-1 text-slate-900">
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}
