import { Person } from "@mui/icons-material";
import { userId } from "../lib/utils";
import { VNEDayj } from "../lib/dayj";
import { useRef, useEffect, useState } from "react";
const AdminChat = ({ threads, currentThread, setCurrentThread, loadMessage, scrollToBottomBoxChat, changedThread, setChangedThread, sendMessage }) => {
  const user_id = userId();
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    if (scrollToBottomBoxChat) {
      scrollToBottomBoxChat(scrollToBottom); // Truyền hàm ra component cha
    }
  }, []);
  useEffect(() => {
    if (changedThread)
      scrollToBottom()
  }, [changedThread])
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView();
    console.log('cuộn xuống dưới')
  }
  const validateInputMessage = () => {
    return inputValue.length > 0;
  }
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container.scrollTop === 0 && container.scrollHeight > container.clientHeight) {
      console.log("Đã cuộn tới đầu");
      // Có thể gọi API để load thêm tin nhắn nếu cần
      loadMessage()
    }
  };
  return (
    <div className="flex w-[100%] h-[calc(100vh-72px)] justify-center pb-10">
      <div className="flex overflow-hidden w-[100%] h-[100%]">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-300 h-[100%] flex flex-col">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-orange-500 text-white">
            <h1 className="text-2xl font-semibold">Trò chuyện</h1>
          </header>

          {/* Contact List */}
          <div className="overflow-y-auto max-h-full p-3 mb-2">
            {threads.length === 0 && (
              <>
                <p className="text-center">Chưa có khách hàng nào nhắn tin</p>
              </>
            )}
            {threads &&
              threads.map((item, index) => (
                <div
                  key={index}
                  className={
                    "flex items-center cursor-pointer hover:bg-gray-100 p-2 mb-2 rounded-md border-0 border-b items-stretch " +
                    (currentThread && currentThread.id === item.id
                      ? " !bg-orange-100"
                      : "")
                  }
                  onClick={() => {
                    if (currentThread && currentThread.id === item.id) return;
                    setChangedThread(false);
                    setCurrentThread(item);
                  }}
                >
                  <div className="p-4 bg-gray-300 rounded-full mr-4">
                    <Person className="!text-2xl text-gray-600" />
                  </div>
                  <div className="flex flex-col items-start justify-center w-full overflow-hidden mr-4">
                    <h2 className="text-lg font-semibold whitespace-nowrap overflow-hidden truncate max-w-full">
                      {item.user.name}
                    </h2>
                    <p className="text-gray-600 text-sm whitespace-nowrap overflow-hidden truncate max-w-full">
                      {item.latest_message.content || "No message yet."}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between relative">
                    <span
                      className={
                        "rounded-full p-1 " +
                        (item.latest_message.sender_id !== user_id &&
                        !item.readed
                          ? "bg-red-600"
                          : "")
                      }
                    ></span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {VNEDayj(item.last_send)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col h-[100%] w-[100%] justify-between">
          <header className="bg-white p-4 text-gray-700">
            <h1 className="text-2xl font-medium text-orange-400">
              {currentThread ? currentThread.user.name : ""}&nbsp;
            </h1>
          </header>
          {currentThread && (
            <>
              <div
                className="overflow-y-auto border-t border-gray-300 h-full max-h-full"
                ref={chatContainerRef}
                onScroll={handleScroll}
              >
                <div className="flex flex-col justify-end pt-4 min-h-full">
                  {currentThread.messages &&
                    [...currentThread.messages].reverse().map((item, index) => {
                      const isLast = (index === currentThread.messages.length - 1);
                      if (item.sender_id === user_id) {
                        return (
                          <div
                            key={item.id}
                            className="flex justify-end mb-4"
                            ref={isLast ? lastMessageRef : null}
                          >
                            <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3 relative pb-5 min-w-[100px] min-h-[56px]">
                              <p>{item.content}</p>
                              {item.readed && (
                                <span className="text-[10px] text-gray-300 absolute right-[12px] bottom-[4px]">
                                  &#10003; {VNEDayj(item.time_read)}
                                </span>
                              )}
                              {!item.readed && (
                                <span className="text-[10px] text-gray-300 absolute right-[12px] bottom-[4px]">
                                  {VNEDayj(item.time_send)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      else {
                        return (
                          <div
                            key={item.id}
                            className="ms-2 flex mb-4"
                            ref={isLast ? lastMessageRef : null}
                          >
                            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                              <Person className="!text-2xl text-gray-600" />
                            </div>
                            <div className="flex max-w-96 bg-white rounded-lg p-3 pb-5 gap-3 relative min-w-[100px] min-h-[56px]">
                              <p className="text-gray-700">{item.content}</p>
                              <span className="text-[10px] text-gray-400 absolute left-[12px] bottom-[4px]">
                                {VNEDayj(item.time_send)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>

              <footer className="bg-white border-t border-gray-300 p-4 bottom-0 w-3/4 w-[100%]">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                    value={inputValue}
                    onChange={(e) => {setInputValue(e.target.value)}}
                  />
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md ml-2"
                    disabled={!validateInputMessage()}
                    onClick={() => {setChangedThread(false); sendMessage(inputValue, setInputValue);}}
                  >
                    Gửi
                  </button>
                </div>
              </footer>
            </>
          )}
          {!currentThread && (
            <div className="h-[100%] bg-white w-100 flex justify-center items-center">
              <p className="text-center text-xl font-bold text-orange-500">
                Trò chuyện & tư vấn cùng khách hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
