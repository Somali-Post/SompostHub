'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Star, Trash2, UserPlus, X } from 'lucide-react';
import { getGroupDetails, removeParticipant } from '@/app/actions/chat';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ChatInfo({ chatId, onClose }: { chatId: string; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await getGroupDetails(chatId);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [chatId]);

  const handleRemove = async (userId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from group?`)) return;
    const res = await removeParticipant(chatId, userId);
    if (res?.success) {
      toast.success(`${userName} removed`);
      loadData();
    } else {
      toast.error('Failed to remove user');
    }
  };

  if (!data && !loading) return null;

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-full animate-in slide-in-from-right duration-300">
      <div className="h-16 flex items-center gap-4 px-4 border-b border-slate-100 shrink-0">
        <button
          onClick={onClose}
          className="text-slate-500 hover:bg-slate-100 p-2 rounded-full"
        >
          <X size={20} />
        </button>
        <h2 className="font-bold text-slate-800">Group info</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center py-8 border-b border-slate-100 bg-white">
          <div className="w-32 h-32 rounded-full bg-slate-200 mb-4 overflow-hidden relative shadow-sm">
            <Image
              src={
                data?.avatar ||
                `https://ui-avatars.com/api/?name=${data?.name || 'Group'}&background=random`
              }
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900 text-center px-4">
            {data?.name || 'Loading...'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Group • {data?.participants?.length || 0} members
          </p>
        </div>

        <div className="p-4 border-b border-slate-100 flex gap-4 justify-center">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary group-hover:bg-slate-50">
              <UserPlus size={20} />
            </div>
            <span className="text-xs text-primary font-medium">Add</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary group-hover:bg-slate-50">
              <Search size={20} />
            </div>
            <span className="text-xs text-primary font-medium">Search</span>
          </div>
        </div>

        <div className="py-2 border-b border-slate-100 bg-white">
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="text-sm font-medium text-slate-700">Add group description</span>
            <span className="text-slate-400">✎</span>
          </button>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <Star size={20} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Starred messages</span>
            </div>
          </button>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Notification settings</span>
            </div>
          </button>
        </div>

        <div className="p-4 bg-white">
          <h3 className="text-sm font-bold text-slate-500 mb-4 px-2">
            {data?.participants?.length} Participants
          </h3>
          <div className="space-y-1">
            {data?.participants?.map((participant: any) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                    <Image
                      src={
                        participant.user.avatar ||
                        `https://ui-avatars.com/api/?name=${participant.user.fullName}&background=random`
                      }
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{participant.user.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {participant.user.jobTitle || participant.user.role}
                    </p>
                  </div>
                </div>

                {data.isCurrentUserAdmin && (
                  <button
                    onClick={() => handleRemove(participant.user.id, participant.user.fullName)}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from group"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
