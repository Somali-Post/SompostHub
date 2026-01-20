'use client';

import { useEffect, useState } from 'react';
import { Check, MessageSquarePlus, MoreVertical, Search, X } from 'lucide-react';
import { getAllStaff, getConversations, createDirectChat, createGroup } from '@/app/actions/chat';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ConversationList({
  onSelect,
  selectedChatId,
}: {
  onSelect: (id: string) => void;
  selectedChatId: string;
}) {
  const [chats, setChats] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [view, setView] = useState<'CHATS' | 'CONTACTS'>('CHATS');
  const [showMenu, setShowMenu] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

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

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length === 0) {
      toast.error('Name and members required');
      return;
    }

    const res = await createGroup(groupName, selectedMembers);
    if (res?.success) {
      toast.success('Group created');
      setShowGroupModal(false);
      setGroupName('');
      setSelectedMembers([]);
      setView('CHATS');
      loadChats();
    } else {
      toast.error('Failed to create group');
    }
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers((prev) => prev.filter((memberId) => memberId !== id));
    } else {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 relative">
      <div className="h-16 bg-slate-50 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        {view === 'CHATS' ? (
          <h1 className="text-xl font-bold text-slate-800">Chats</h1>
        ) : (
          <button onClick={() => setView('CHATS')} className="text-slate-600 font-bold">
            Back
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
              <button
                onClick={() => {
                  setShowGroupModal(true);
                  setShowMenu(false);
                  openContacts();
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
              >
                New group
              </button>
              <button
                onClick={() => toast.info('Feature coming soon')}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
              >
                Starred messages
              </button>
              <button
                onClick={() => toast.info('Feature coming soon')}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
              >
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
        {view === 'CHATS'
          ? chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`flex items-center gap-3 p-3 cursor-pointer border-b border-slate-50 ${
                  selectedChatId === chat.id ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
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
          : staff.map((user) => (
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
            ))}
      </div>

      {showGroupModal && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom">
          <div className="h-16 bg-slate-50 border-b border-slate-200 flex items-center gap-4 px-4">
            <button
              onClick={() => {
                setShowGroupModal(false);
                setGroupName('');
                setSelectedMembers([]);
                setView('CHATS');
              }}
            >
              <X size={24} />
            </button>
            <h2 className="font-bold text-lg">New Group</h2>
          </div>

          <div className="p-4 border-b border-slate-100">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Subject"
              className="w-full border-b-2 border-slate-200 focus:border-auth-button py-2 outline-none text-lg"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">Select Members</p>
            {staff.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleMember(user.id)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded-lg"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedMembers.includes(user.id)
                      ? 'bg-auth-button border-auth-button text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMembers.includes(user.id) && <Check size={14} />}
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
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
                <span className="font-medium text-sm">{user.fullName}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleCreateGroup}
              className="w-full bg-auth-button text-white py-3 rounded-xl font-bold"
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
