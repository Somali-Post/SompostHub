import { getInboxMessages } from '@/app/actions/inbox';
import { getTasks } from '@/app/actions/tasks';
import { Calendar as CalendarIcon } from 'lucide-react';

export default async function AdminInboxPage() {
  const messages = await getInboxMessages();
  const tasks = await getTasks();

  return (
    <div className="flex h-full w-full bg-white border-t border-slate-200 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex gap-6">
            <button className="pb-4 border-b-2 font-bold text-sm border-auth-button text-auth-button">
              All Messages ({messages.length})
            </button>
            <button className="pb-4 border-b-2 font-bold text-sm border-transparent text-slate-500">
              System Alerts
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 w-48">Sender</th>
                <th className="px-6 py-3">Message Preview</th>
                <th className="px-6 py-3 w-32 text-center">Role</th>
                <th className="px-6 py-3 w-48 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.length > 0 ? (
                messages.map((msg: any) => (
                  <tr key={msg.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{msg.sender}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{msg.subject}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">
                        {msg.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400 font-mono">
                      {msg.time}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    Inbox is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden xl:flex">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Daily Agenda</h3>
            <CalendarIcon size={14} className="text-slate-400" />
          </div>
          <div className="space-y-4 relative">
            <div className="absolute left-[2.25rem] top-2 bottom-0 w-px bg-slate-200"></div>
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <div key={task.id} className="flex gap-4 relative">
                  <div className="flex flex-col items-center w-12 shrink-0 pt-1">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(task.createdAt).getHours()}:00
                    </span>
                    <div className="w-2 h-2 rounded-full bg-white border-2 border-slate-300 mt-1 z-10"></div>
                  </div>
                  <div
                    className={`flex-1 bg-white p-3 rounded-lg border-l-4 shadow-sm ${
                      task.priority === 'HIGH' ? 'border-red-500' : 'border-auth-button'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">{task.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{task.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-4">No tasks scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
