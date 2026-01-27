import { getTasks, createTask, toggleTask } from '@/app/actions/tasks';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { TaskCheckbox, CreateTaskForm } from './client-components';

type TaskItem = {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
};

export default async function TasksPage() {
  const tasks = (await getTasks()) as TaskItem[];

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks & Calendar</h1>
          <p className="text-slate-500 text-sm">Manage daily postal duties.</p>
        </div>
        <CreateTaskForm action={createTask} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="w-full md:w-[400px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
            My Tasks
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center p-8 text-slate-400">No tasks found.</div>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex-col items-center justify-center text-slate-400">
          <CalendarIcon size={48} className="mb-4 opacity-20" />
          <p>Calendar View Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: TaskItem }) {
  const isCompleted = task.status === 'COMPLETED';
  const priorityTone =
    task.priority === 'HIGH'
      ? 'bg-red-100 text-red-600'
      : task.priority === 'LOW'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-blue-100 text-blue-600';

  return (
    <div
      className={`p-3 border rounded-lg transition-all ${isCompleted
          ? 'bg-slate-50 border-slate-100 opacity-60'
          : 'bg-white border-slate-200 hover:shadow-sm'
        }`}
    >
      <div className="flex gap-3">
        <TaskCheckbox id={task.id} status={task.status} action={toggleTask} />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4
              className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
            >
              {task.title}
            </h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityTone}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
