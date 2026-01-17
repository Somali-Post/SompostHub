'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

type TaskToggleAction = (id: string, currentStatus: string) => Promise<void>;
type TaskCreateAction = (formData: FormData) => Promise<void>;

type TaskCheckboxProps = {
  id: string;
  status: string;
  action: TaskToggleAction;
};

type CreateTaskFormProps = {
  action: TaskCreateAction;
};

export function TaskCheckbox({ id, status, action }: TaskCheckboxProps) {
  const [checked, setChecked] = useState(status === 'COMPLETED');

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={async () => {
        setChecked(!checked);
        await action(id, status);
      }}
      className="mt-1 w-4 h-4 rounded border-slate-300 text-auth-button focus:ring-auth-button cursor-pointer"
    />
  );
}

export function CreateTaskForm({ action }: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 items-center gap-2 rounded-lg bg-auth-button px-3 text-sm font-semibold text-white hover:bg-auth-buttonHover shadow-sm"
      >
        <Plus size={16} /> New Task
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await action(formData);
        setIsOpen(false);
      }}
      className="flex gap-2 animate-in fade-in slide-in-from-right-4"
    >
      <input
        name="title"
        placeholder="Task Title..."
        className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
        required
        autoFocus
      />
      <select name="priority" className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="LOW">Low</option>
      </select>
      <button
        type="submit"
        className="h-9 px-3 bg-green-600 text-white rounded-lg text-xs font-bold"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="h-9 px-3 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
      >
        X
      </button>
    </form>
  );
}
