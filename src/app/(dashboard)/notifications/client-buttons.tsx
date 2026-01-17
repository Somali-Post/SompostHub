'use client';

import { Check } from 'lucide-react';

type NotificationButtonProps = {
  id: string;
  action: (id: string) => Promise<void>;
};

export function NotificationButton({ id, action }: NotificationButtonProps) {
  return (
    <button
      onClick={() => action(id)}
      className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-primary transition-colors"
      title="Mark as Read"
    >
      <Check size={18} />
    </button>
  );
}
