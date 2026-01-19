'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Mic, Plus, Send, Video } from 'lucide-react';
import { getMessages, sendMessage } from '@/app/actions/chat';

export default function ChatThread({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => setCurrentUserId(user?.id || ''))
      .catch(() => setCurrentUserId(''));
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const load = async () => {
      const data = await getMessages(chatId);
      setMessages(data);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(chatId, input);
    setInput('');
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#efeae2] text-slate-400">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
        }}
      ></div>

      <div className="h-16 bg-slate-50 border-b border-slate-200 flex items-center px-4 shrink-0 z-10">
        <div className="w-10 h-10 rounded-full bg-slate-300 mr-3"></div>
        <div>
          <h2 className="font-bold text-slate-800">Chat Name</h2>
          <p className="text-xs text-slate-500">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 z-10">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] p-2 px-3 rounded-lg shadow-sm text-sm ${
                  isMe ? 'bg-[#d9fdd3] text-slate-900' : 'bg-white text-slate-900'
                }`}
              >
                {msg.content}
                <span className="text-[10px] text-slate-400 block text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-slate-50 flex items-center gap-2 z-10">
        <div className="relative">
          <button
            onClick={() => setShowAttach((prev) => !prev)}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full"
          >
            <Plus size={24} />
          </button>
          {showAttach && (
            <div className="absolute bottom-12 left-0 bg-white shadow-xl rounded-xl p-2 flex flex-col gap-2 animate-in slide-in-from-bottom-2">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                <FileText size={18} className="text-purple-500" /> Document
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                <ImageIcon size={18} className="text-blue-500" /> Photos
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                <Video size={18} className="text-pink-500" /> Videos
              </button>
            </div>
          )}
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white border-none rounded-lg py-2 px-4 focus:ring-0"
          placeholder="Type a message"
        />

        {input ? (
          <button onClick={handleSend} className="p-2 text-primary">
            <Send size={24} />
          </button>
        ) : (
          <button className="p-2 text-slate-500">
            <Mic size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
