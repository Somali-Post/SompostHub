'use client';

import { useState } from 'react';
import ConversationList from '@/components/chat/conversation-list';
import ChatThread from '@/components/chat/chat-thread';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('');

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      <div className="w-[30%] min-w-[320px] h-full border-r border-slate-200">
        <ConversationList onSelect={setSelectedChat} />
      </div>
      <div className="flex-1 h-full bg-[#efeae2]">
        <ChatThread chatId={selectedChat} />
      </div>
    </div>
  );
}
