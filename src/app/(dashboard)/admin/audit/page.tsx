import { prisma } from '@/lib/prisma';

export default async function AuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8 gap-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold text-slate-900">System Audit Log</h1>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-mono text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{log.actorName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">
                      {log.actorRole}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 font-bold text-slate-700">{log.action}</td>
                <td className="px-6 py-3 text-slate-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
