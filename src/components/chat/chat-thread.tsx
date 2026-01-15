"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  ThumbsUp,
  Video,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type Message = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  reactions?: string[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "Fartun Jama",
    text: "Good morning everyone. I've uploaded the customs clearance reports for the last batch.",
    time: "10:45 AM",
    isMe: false,
    reactions: ["👍"],
  },
  {
    id: "2",
    sender: "You",
    text: "Excellent work, Fartun. I'll review these shortly.",
    time: "11:02 AM",
    isMe: true,
  },
  {
    id: "3",
    sender: "Ayan Barre",
    text: "Van 4 has arrived at the checkpoint.",
    time: "11:15 AM",
    isMe: false,
  },
];

export default function ChatThread() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    setShowEmoji(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const startCall = (type: "audio" | "video") => {
    setCallType(type);
    setIsCalling(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] relative font-sans">
      {isCalling && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl font-bold">L</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Logistics Team</h2>
          <p className="text-slate-400 mb-12">
            {callType === "audio" ? "Audio Calling..." : "Video Calling..."}
          </p>
          <div className="flex gap-8">
            <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
              <Mic />
            </button>
            <button
              onClick={() => setIsCalling(false)}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
            >
              <Phone className="rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}

      <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            L
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Logistics Team</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs text-slate-500">12 members active</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-slate-500">
          <button
            onClick={() => startCall("audio")}
            className="p-2 hover:bg-slate-100 rounded-full hover:text-auth-button transition-colors"
          >
            <Phone size={20} />
          </button>
          <button
            onClick={() => startCall("video")}
            className="p-2 hover:bg-slate-100 rounded-full hover:text-auth-button transition-colors"
          >
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full hover:text-auth-button transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-center">
          <span className="text-[10px] bg-slate-200/80 px-3 py-1 rounded-full text-slate-500 font-bold shadow-sm backdrop-blur-sm">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""} group`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                msg.isMe ? "bg-auth-button" : "bg-slate-400"
              }`}
            >
              {msg.isMe ? "YOU" : msg.sender[0]}
            </div>

            <div
              className={`flex flex-col ${
                msg.isMe ? "items-end" : "items-start"
              } max-w-[70%]`}
            >
              <div className="flex items-baseline gap-2 mb-1 px-1">
                <span
                  className={`text-xs font-bold ${
                    msg.isMe ? "text-auth-button" : "text-slate-700"
                  }`}
                >
                  {msg.sender}
                </span>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>

              <div
                className={`relative p-3.5 text-sm shadow-sm leading-relaxed ${
                  msg.isMe
                    ? "bg-auth-button text-white rounded-2xl rounded-tr-none"
                    : "bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100"
                }`}
              >
                {msg.text}

                {msg.reactions && (
                  <div className="absolute -bottom-2 right-2 bg-white border border-slate-100 rounded-full px-1.5 py-0.5 shadow-sm flex gap-0.5 text-[10px]">
                    {msg.reactions.map((reaction) => (
                      <span key={reaction}>{reaction}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                <button className="text-slate-400 hover:text-yellow-500 transition-colors">
                  <ThumbsUp size={12} />
                </button>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <Heart size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 z-20">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-end gap-2 shadow-inner focus-within:ring-2 focus-within:ring-auth-button/20 focus-within:border-auth-button transition-all">
          <button className="p-2.5 text-slate-400 hover:text-auth-button hover:bg-slate-100 rounded-xl transition-colors">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 py-2.5">
            <input
              className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400 text-slate-700"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-2.5 rounded-xl transition-colors ${
                showEmoji
                  ? "text-auth-button bg-auth-button/10"
                  : "text-slate-400 hover:text-auth-button hover:bg-slate-100"
              }`}
            >
              <Smile size={20} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 right-0 shadow-xl rounded-xl border border-slate-200 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-auth-button text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-auth-buttonHover shadow-md shadow-auth-button/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
