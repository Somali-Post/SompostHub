import { getNotifications, markAsRead, clearAllNotifications } from '@/app/actions/notifications';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import { NotificationButton } from './client-buttons';

export default async function NotificationCenter() {
  const notifications = await getNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8 gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notification Center</h1>
          <p className="text-slate-500 text-sm mt-1">
            You have {unreadCount} unread alerts.
          </p>
        </div>
        <form action={clearAllNotifications}>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-all">
            <Trash2 size={16} /> Clear My Alerts
          </button>
        </form>
      </div>

      <div className="space-y-4 max-w-4xl">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-4 bg-white p-5 rounded-xl border-l-4 shadow-sm border-y border-r border-slate-200 hover:shadow-md transition-all group ${
                n.isRead ? 'opacity-60' : ''
              } ${n.type === 'ALERT' ? 'border-l-red-500' : 'border-l-blue-500'}`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'ALERT' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}
              >
                {n.type === 'ALERT' ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">{n.title}</h4>
                  {!n.isRead && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{n.message}</p>
                <span className="text-[11px] text-slate-400 font-bold uppercase mt-2 inline-block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.isRead && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <NotificationButton id={n.id} action={markAsRead} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            All caught up! No notifications.
          </div>
        )}
      </div>
    </div>
  );
}
