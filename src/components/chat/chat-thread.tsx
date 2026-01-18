'use client';

import { useEffect, useRef, useState } from 'react';
import { Video, MoreVertical, Paperclip, Smile, Send } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import DailyIframe from '@daily-co/daily-js';
import { getMessages, sendMessage } from '@/app/actions/chat';
import { createDailyRoom } from '@/app/actions/daily';
import { toast } from 'sonner';

type ChatMessage = {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  time: string;
};

export default function ChatThread() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeCallUrl, setActiveCallUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<HTMLDivElement>(null);
  const callObjectRef = useRef<ReturnType<typeof DailyIframe.createFrame> | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => setCurrentUserId(user?.id || ''))
      .catch(() => setCurrentUserId(''));

    const fetchMsgs = async () => {
      const data = await getMessages();
      setMessages(data);
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(
    () => () => {
      callObjectRef.current?.destroy();
      callObjectRef.current = null;
    },
    []
  );

  const startVideoCall = async () => {
    toast('Start a video call?', {
      action: {
        label: 'Start Call',
        onClick: async () => {
          try {
            const url = await createDailyRoom();
            await sendMessage(`Started a Video Call. Click to join: ${url}`);
            joinCall(url);
            toast.success('Call started');
          } catch (error) {
            toast.error('Failed to start call');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const extractUrl = (text: string) => text.match(/https?:\/\/\S+/)?.[0];

  const joinCall = (url: string) => {
    setActiveCallUrl(url);
    setTimeout(() => {
      if (!callFrameRef.current) return;

      callObjectRef.current?.destroy();
      callObjectRef.current = DailyIframe.createFrame(callFrameRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '12px',
        },
        showLeaveButton: true,
      });

      callObjectRef.current.join({ url });

      callObjectRef.current.on('left-meeting', () => {
        callObjectRef.current?.destroy();
        callObjectRef.current = null;
        setActiveCallUrl(null);
      });
    }, 100);
  };

  const closeCall = () => {
    callObjectRef.current?.leave();
    callObjectRef.current?.destroy();
    callObjectRef.current = null;
    setActiveCallUrl(null);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const tempMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'You',
      senderId: currentUserId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    setShowEmoji(false);

    await sendMessage(tempMsg.text);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] relative font-sans">
      {activeCallUrl && (
        <div className="absolute inset-0 z-50 bg-slate-900 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2 text-white">
            <h3 className="font-bold">Active Call</h3>
            <button
              onClick={closeCall}
              className="p-2 bg-red-600 rounded-lg text-sm font-bold"
            >
              Close / Minimize
            </button>
          </div>
          <div
            ref={callFrameRef}
            className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl"
          ></div>
        </div>
      )}

      <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white font-bold shadow-sm">
            L
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Logistics Team</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-xs text-slate-500">Active Channel</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-slate-500">
          <button
            onClick={startVideoCall}
            className="p-2 hover:bg-slate-100 rounded-full hover:text-primary transition-colors"
            title="Start Video Call"
          >
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full hover:text-primary transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const callUrl = extractUrl(msg.text);

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group`}>
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                  isMe ? 'bg-primary' : 'bg-slate-400'
                }`}
              >
                {msg.sender[0]}
              </div>
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className={`text-xs font-bold ${isMe ? 'text-primary' : 'text-slate-700'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>

                <div
                  className={`relative p-3.5 text-sm shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-2xl rounded-tr-none'
                      : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100'
                  }`}
                >
                  {callUrl ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-bold flex items-center gap-2">
                        <Video size={16} /> Video Call Invite
                      </p>
                      <button
                        onClick={() => joinCall(callUrl)}
                        className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
                      >
                        Join Call
                      </button>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 z-20">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-end gap-2 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 py-2.5">
            <input
              className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400 text-slate-700"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-2.5 rounded-xl transition-colors ${
                showEmoji
                  ? 'text-primary bg-primary/10'
                  : 'text-slate-400 hover:text-primary hover:bg-slate-100'
              }`}
            >
              <Smile size={20} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 right-0 shadow-xl rounded-xl border border-slate-200 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/90 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
