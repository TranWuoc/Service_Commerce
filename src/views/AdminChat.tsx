import { Person, Image } from "@mui/icons-material";
import { userId } from "../lib/utils";
import { VNEDayj } from "../lib/dayj";
import { useRef, useEffect, useState } from "react";
import { ImageView } from "./ImageView";
import { Message } from "../types/Message";
import { ImageType } from "../types/Image";
import { Thread } from "../types/Thread";
import "../assets/css/bouncingText.css";
const AdminChat = ({
  threads,
  currentThread,
  setCurrentThread,
  changedThread,
  setChangedThread,
  sendMessage,
  imagesUpload,
  setImagesUpload,
  nextThreads,
  getMessages,
  typing
}) => {
  const fileInputRef = useRef(null);
  const baseApi = "http://localhost:8000/";
  const user_id = userId();
  const chatContainerRef = useRef(null);
  const contactContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [imageView, setImageView] = useState(undefined);
  useEffect(() => {
    if (changedThread) scrollToBottom();
  }, [changedThread]);
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView();
    setChangedThread(false);
  };
  const validateInputMessage = () => {
    return inputValue.length > 0 || imagesUpload.length > 0;
  };
  const handleScrollChat = async () => {
    const container = chatContainerRef.current;

    if (
      container.scrollTop === 0 &&
      container.scrollHeight > container.clientHeight
    ) {
      const prevScrollHeight = container.scrollHeight;

      console.log("Đã cuộn tới đầu");
      await getMessages(); // Hàm này cần thêm messages mới vào đầu danh sách

      // Đợi render xong (bằng setTimeout 0 hoặc next tick)
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight;
        container.scrollTop = scrollDiff; // Giữ nguyên vị trí cuộn
      }, 0);
    }
  };

  const handleScrollContact = () => {
    const container = contactContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10;

    if (isAtBottom) {
      console.log("Đã cuộn tới cuối");
      nextThreads();
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      alert("Chỉ được chọn file ảnh!");
      return;
    }

    const availableSlots = 4 - imagesUpload.length;
    if (availableSlots <= 0) return;

    const selectedImages = imageFiles
      .slice(0, availableSlots)
      .map((file) => ({ link: URL.createObjectURL(file), file: file }));

    setImagesUpload((prev) => [...prev, ...selectedImages]);

    scrollToBottom();

    fileInputRef.current.value = "";
  };
  const renderImages = (message: Message) => {
    return (
      <div
        className={`w-[100%] flex flex-row flex-wrap ${message.sender_id === user_id ? 'mr-2' : ''} ${message.sender_id === user_id ? "justify-end" : ""}`}
      >
        {message.images.map((item: ImageType, index: number) => {
          return (
            <img
              key={index}
              className="rounded-xl cursor-pointer h-[100px] w-[100px]"
              src={baseApi + item.image_url}
              alt="image"
              onClick={() => {
                setImageView(item);
              }}
              onError={() => {
                this.onerror = null;
                this.src = "https://via.placeholder.com/100";
              }}
            />
          );
        })}
      </div>
    );
  };
  const renderMessageBox = () => {
    return (
      <>
        <div
          className="overflow-y-auto border-t border-gray-300 h-full max-h-full"
          ref={chatContainerRef}
          onScroll={handleScrollChat}
        >
          <div className="flex flex-col justify-end pt-4 min-h-full">
            {currentThread.messages &&
              [...currentThread.messages]
                .reverse()
                .map((item, index) => renderMessageItem(item, index))}
            {typing && (
              <div
                key={-1}
                className="ms-2 flex mb-4 items-center"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <Person className="!text-2xl text-gray-600" />
                </div>
                <div>
                  <div className="bouncing-text text-xs text-gray-500">
                    {"Đối phương đang nhập...".split("").map((char, index) => (
                      <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                        {char}&nbsp;
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="bg-white border-t border-gray-300 p-4 bottom-0 max-w-[100%]">
          {imagesUpload.length > 0 && (
            <div className="max-w-[100%] bg-white overflow-x-hidden mb-2">
              <p className="text-xs mb-2 text-gray-500">
                {imagesUpload.length}/4
              </p>
              <ul className="max-w-full flex flex-row flex-nowrap w-full overflow-x-auto">
                {imagesUpload.map((image, index) => (
                  <li
                    key={index}
                    className={`relative min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] me-2 group`}
                  >
                    <img
                      src={image.link}
                      alt={`image-${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-[2px] right-[2px] px-1 text-xs rounded-full bg-gray-200 text-black/40 opacity-0 group-hover:opacity-100 hover:bg-gray-300 transition"
                      onClick={() => {
                        setImagesUpload(
                          imagesUpload.filter(
                            (_item, index1: number) => index !== index1,
                          ),
                        );
                      }}
                    >
                      x
                    </button>
                  </li>
                ))}
                {imagesUpload.length < 4 && (
                  <li
                    className="group min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] border border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    <span className="text-4xl text-gray-400 group-hover:text-gray-500">
                      +
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
          <div className="flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <span
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              <Image className="mr-2 text-orange-500 text-lg cursor-pointer" />
            </span>
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            <button
              className={`bg-orange-500 text-white px-4 py-2 rounded-md ml-2 ${validateInputMessage() ? 'hover:bg-orange-600' : ''}`}
              disabled={!validateInputMessage()}
              onClick={() => {
                setChangedThread(false);
                sendMessage(inputValue, setInputValue);
              }}
            >
              Gửi
            </button>
          </div>
        </footer>
      </>
    );
  };
  const renderMessageItem = (item: Message, index: number) => {
    const isLast = index === currentThread.messages.length - 1;
    if (item.sender_id === user_id) {
      return (
        <div
          key={index}
          className="flex flex-col items-end justify-end mb-4"
          ref={isLast ? lastMessageRef : null}
        >
          {item.images && renderImages(item)}
          <div className="max-w-96 bg-orange-500 text-white rounded-lg p-3 gap-3 relative pb-5 min-w-[100px] mr-2">
            <p>{item.content}</p>
            {item.readed && (
              <span className="text-[10px] text-gray-100 absolute right-[12px] bottom-[4px]">
                &#10003; {VNEDayj(item.time_read)}
              </span>
            )}
            {!item.readed && (
              <span className="text-[10px] text-gray-100 absolute right-[12px] bottom-[4px]">
                {VNEDayj(item.time_send)}
              </span>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="ms-2 flex mb-4 items-end"
          ref={isLast ? lastMessageRef : null}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <Person className="!text-2xl text-gray-600" />
          </div>
          <div>
            {item.images && renderImages(item)}
            <div className="max-w-96 bg-white rounded-lg p-3 pb-5 gap-3 relative min-w-[100px]">
              <p className="text-gray-700">{item.content}</p>
              <span className="text-[10px] text-gray-400 absolute left-[12px] bottom-[4px]">
                {VNEDayj(item.time_send)}
              </span>
            </div>
          </div>
        </div>
      );
    }
  };
  const renderContactList = () => {
    return (
      threads &&
      threads.map((item: Thread, index: number) => (
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
              {item.user?.name}
            </h2>
            <p className="text-gray-600 text-sm whitespace-nowrap overflow-hidden truncate max-w-full">
              {item.latest_message.content ||
                (user_id === item.latest_message.sender_id
                  ? "You "
                  : "Enemy ") + "sent some pictures"}
            </p>
          </div>
          <div className="flex flex-col items-end justify-between relative">
            <span
              className={
                "rounded-full p-1 " +
                (item.latest_message.sender_id !== user_id && !item.readed
                  ? "bg-red-600"
                  : "")
              }
            ></span>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {VNEDayj(item.last_send)}
            </span>
          </div>
        </div>
      ))
    );
  };
  return (
    <div className="flex w-[100%] h-[calc(100vh-72px*2)] justify-center relative">
      <ImageView image={imageView} setImage={setImageView} />
      <div className="flex overflow-hidden w-[100%] h-[100%]">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-300 h-[100%] flex flex-col">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-orange-500 text-white">
            <h1 className="text-2xl font-semibold">Trò chuyện</h1>
          </header>

          {/* Contact List */}
          <div
            className="overflow-y-auto max-h-full p-3 mb-2"
            ref={contactContainerRef}
            onScroll={handleScrollContact}
          >
            {!threads ||
              (threads.length === 0 && (
                <>
                  <p className="text-center">Chưa có khách hàng nào nhắn tin</p>
                </>
              ))}
            {threads && renderContactList()}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col h-[100%] w-[100%] justify-between">
          <header className="bg-white p-4 text-gray-700">
            <h1 className="text-2xl font-medium text-orange-400">
              {currentThread ? currentThread.user?.name : ""}&nbsp;
            </h1>
          </header>
          {currentThread && renderMessageBox()}
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
