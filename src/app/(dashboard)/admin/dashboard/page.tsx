import type { ReactNode } from 'react';
import { TrendingUp, Package, Users, CheckCircle, Clock } from 'lucide-react';
import { getDashboardStats } from '@/app/actions/dashboard';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

type StatCardProps = {
  title: string;
  value: number | string;
  unit: string;
  icon: ReactNode;
};

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/chat');
  }

  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Operational Command</h1>
          <p className="text-slate-500">Real-time status overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        <StatCard
          title="Total Volume"
          value={stats.volume}
          unit="items"
          icon={<Package className="text-auth-button" />}
        />
        <StatCard
          title="Total Weight"
          value={stats.weight}
          unit="kg"
          icon={<TrendingUp className="text-amber-500" />}
        />
        <StatCard
          title="Active Staff"
          value={stats.staff}
          unit="Users"
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.issues}
          unit="Active"
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Live Activity Feed</h3>
        <div className="space-y-4">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-full">
                    <Clock size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Item Scanned: {scan.barcode}
                    </p>
                    <p className="text-xs text-slate-500">
                      by {scan.scanner?.fullName || 'Unknown'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(scan.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
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
