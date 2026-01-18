"use client";

import { useState } from 'react';
import clsx from 'clsx';
import ConversationList from "@/components/chat/conversation-list";
import ChatThread from "@/components/chat/chat-thread";
import ChatInfo from "@/components/chat/chat-info";

export default function ChatPage() {
  const [showThread, setShowThread] = useState(false);

  return (
    <div className="flex h-full w-full bg-white border-t border-slate-200 overflow-hidden">
      <div
        className={clsx(
          "flex flex-col shrink-0 z-10 bg-white border-r border-slate-200 transition-all",
          showThread ? "hidden md:flex md:w-80" : "w-full md:w-80"
        )}
      >
        <ConversationList onSelect={() => setShowThread(true)} />
      </div>

      <div
        className={clsx(
          "flex-col min-w-0 z-0 bg-slate-50/30 md:flex md:flex-1",
          showThread ? "flex flex-1 w-full" : "hidden"
        )}
      >
        <ChatThread onBack={() => setShowThread(false)} />
      </div>

      <div className="w-72 border-l border-slate-200 bg-white hidden xl:flex flex-col shrink-0 z-10">
        <ChatInfo />
      </div>
    </div>
  );
}
