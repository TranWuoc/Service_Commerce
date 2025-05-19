import React from "react";
import { Message } from "../../types/Bot"; 
import MessageItem from "./MessageItem"; 

type Props = {
  messages: Message[];
  loadMoreMessages: () => void;
  endOfMessagesRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean; // thêm
};

const MessageList: React.FC<Props> = ({ messages, loadMoreMessages ,endOfMessagesRef,chatContainerRef,isVisible}) => {

  const handleScroll = () => {
   if (!isVisible) return; // ✅ chưa mở bot thì không gọi

    if (chatContainerRef.current && chatContainerRef.current.scrollTop < 100) {
      loadMoreMessages();
    }
  };

  return (
    <div ref={chatContainerRef} onScroll={handleScroll} className="p-4 h-96 overflow-y-auto space-y-2">
      {messages.map((msg, idx) => (
        <MessageItem key={idx} msg={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
