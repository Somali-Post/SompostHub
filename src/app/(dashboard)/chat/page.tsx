'use client';

import { useState } from 'react';
import ConversationList from '@/components/chat/conversation-list';
import ChatThread from '@/components/chat/chat-thread';
import ChatInfo from '@/components/chat/chat-info';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      <div
        className={`h-full border-r border-slate-200 w-full md:w-[30%] md:min-w-[320px] ${selectedChat ? 'hidden md:block' : 'block'
          }`}
      >
        <ConversationList
          onSelect={(id) => {
            setSelectedChat(id);
            setShowInfo(false);
          }}
          selectedChatId={selectedChat}
        />
      </div>

      <div
        className={`flex-1 h-full bg-[#efeae2] relative flex-col min-w-0 ${!selectedChat ? 'hidden md:flex' : 'flex'
          }`}
      >
        <ChatThread
          chatId={selectedChat}
          onToggleInfo={() => setShowInfo(!showInfo)}
          onBack={() => setSelectedChat('')}
        />
      </div>

      {showInfo && selectedChat && (
        <div className="hidden md:block w-[30%] min-w-[300px] h-full border-l border-slate-200 bg-white z-20">
          <ChatInfo chatId={selectedChat} onClose={() => setShowInfo(false)} />
        </div>
      )}
    </div>
  );
}
