"use client";

import ConversationList from "@/components/chat/conversation-list";
import ChatThread from "@/components/chat/chat-thread";
import ChatInfo from "@/components/chat/chat-info";

export default function ChatPage() {
  return (
    <div className="flex h-full w-full bg-white border-t border-slate-200 overflow-hidden">
      <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 z-10 bg-white">
        <ConversationList />
      </div>

      <div className="flex-1 flex flex-col min-w-0 z-0 bg-slate-50/30">
        <ChatThread />
      </div>

      <div className="w-72 border-l border-slate-200 bg-white hidden xl:flex flex-col shrink-0 z-10">
        <ChatInfo />
      </div>
    </div>
  );
}
