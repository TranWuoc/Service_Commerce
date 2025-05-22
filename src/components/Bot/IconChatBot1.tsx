import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import ChatBot from "../../components/ChatBot";

const IconChatBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ✅ Hàm đếm tin nhắn chưa đọc
 const updateUnreadCount = () => {
  const saved = JSON.parse(localStorage.getItem("chatMessages") || "[]");
  const lastRead = localStorage.getItem("lastReadTime");
  const lastReadTime = lastRead ? new Date(lastRead).getTime() : 0;

  const count = saved.filter((msg: any) => {
    if (msg.sender !== "bot") return false;

    const msgTime = new Date(msg.timestamp).getTime();

    // ✅ Nếu cửa sổ đang mở, không tính là chưa đọc
    if (isChatOpen) return false;

    // ✅ Chỉ tính là chưa đọc nếu sau 2 giây so với thời gian đã đọc
    return msgTime > lastReadTime + 2000;
  }).length;

  setUnreadCount(count);
};

  // ✅ Gọi lại khi mở/tắt chat và định kỳ
  useEffect(() => {
    updateUnreadCount();

    const interval = setInterval(updateUnreadCount, 1000); // mỗi 1 giây
    window.addEventListener("storage", updateUnreadCount); // hỗ trợ realtime nếu có nhiều tab

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateUnreadCount);
    };
  }, []);

  // ✅ Khi mở chat thì cập nhật thời gian đã đọc
  useEffect(() => {
    if (isChatOpen) {
      localStorage.setItem("lastReadTime", new Date().toISOString());
      setUnreadCount(0); // reset đếm
    }
  }, [isChatOpen]);
useEffect(() => {
  updateUnreadCount(); // Gọi lại mỗi khi mở/tắt chat
}, [isChatOpen]);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="text-foreground rounded-full flex items-center justify-center 
             fixed bottom-10 right-10 w-fit z-50"
          aria-label="Chat Bot"
          name="Chat Bot"
        >
          <span className="relative w-17 h-17 p-4 flex items-center justify-center
                    rounded-full border-2 border-yellow-600 bg-transparent hover:bg-yellow-50 transition">
            <FaRobot size={50} className="text-yellow-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </span>
        </button>
      )}

      {/* Popup ChatBot */}
      <div className="fixed bottom-20 right-6 z-50">
        <ChatBot isVisible={isChatOpen} onClose={() => setIsChatOpen(false) } /> 
      </div>
    </>
  );
};

export default IconChatBot;
