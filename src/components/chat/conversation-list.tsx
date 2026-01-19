'use client';

import { useEffect, useState } from 'react';
import { MessageSquarePlus, MoreVertical, Search } from 'lucide-react';
import { getAllStaff, getConversations, createDirectChat } from '@/app/actions/chat';
import Image from 'next/image';

export default function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  const [chats, setChats] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [view, setView] = useState<'CHATS' | 'CONTACTS'>('CHATS');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const data = await getConversations();
    setChats(data);
  };

  const openContacts = async () => {
    const data = await getAllStaff();
    setStaff(data);
    setView('CONTACTS');
  };

  const handleContactClick = async (userId: string) => {
    const chatId = await createDirectChat(userId);
    if (chatId) {
      onSelect(chatId);
      setView('CHATS');
      loadChats();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 bg-slate-50 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        {view === 'CHATS' ? (
          <h1 className="text-xl font-bold text-slate-800">Chats</h1>
        ) : (
          <button onClick={() => setView('CHATS')} className="text-slate-600 font-bold">
            ← Back
          </button>
        )}

        <div className="flex gap-4 text-slate-600 relative">
          <button onClick={openContacts} title="New Chat">
            <MessageSquarePlus size={20} />
          </button>
          <button onClick={() => setShowMenu((prev) => !prev)}>
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white shadow-xl rounded-lg border border-slate-100 z-50 py-2">
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                New group
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                Starred messages
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                Select chats
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-b border-slate-100">
        <div className="relative bg-slate-100 rounded-lg">
          <Search className="absolute left-3 top-2 text-slate-400" size={18} />
          <input
            className="w-full bg-transparent border-none py-2 pl-10 text-sm focus:ring-0"
            placeholder="Search or start a new chat"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'CHATS' ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                <Image
                  src={
                    chat.avatar ||
                    `https://ui-avatars.com/api/?name=${chat.name}&background=random`
                  }
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-slate-900 truncate">{chat.name}</h3>
                  <span className="text-[10px] text-slate-400">
                    {chat.time
                      ? new Date(chat.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))
        ) : (
          staff.map((user) => (
            <div
              key={user.id}
              onClick={() => handleContactClick(user.id)}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                <Image
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.fullName}&background=random`
                  }
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{user.fullName}</h3>
                <p className="text-xs text-slate-500">{user.jobTitle || user.role}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
