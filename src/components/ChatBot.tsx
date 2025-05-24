import React, { useState, useEffect, useRef } from "react";
import { Message } from "../types/Bot"; // Import Message type từ types.ts
import Header from "../components/Bot/Header";
import MessageList from "../components/Bot/MessageList";
import ChatInput from "../components/Bot/ChatInput";
import axiosInstance from "../api/axiosInstance"; // sửa đường dẫn nếu khác
import channel from "../listener/channel"; // sửa đường dẫn nếu khác
import Inforcard from "../components/Bot/InforCard";
import HistoryCard from "../components/Bot/HistoryCard";
import { Field } from "../types/Field";

type Props = {
  onClose: () => void;
  isVisible: boolean;
};

const ChatBot: React.FC<Props> = ({ onClose, isVisible }) => {
  const [input, setInput] = useState<string>(""); // State cho input của người dùng
  const [showMenu, setShowMenu] = useState<boolean>(false); // Hiển thị menu
  const [hasMore, setHasMore] = useState(0); // Kiểm tra có còn tin nhắn để tải không
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true); // Quyết định có cuộn xuống dưới mỗi khi có tin nhắn mới không
  const menuRef = useRef<HTMLUListElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [page, setpage] = useState(1);
  const isFetchingRef = useRef(false);
  const isFirstScroll = useRef(true);
  const fetchedPages = useRef<Set<number>>(new Set());
  const [thread_id, setThreadId] = useState<string>(""); // ID của cuộc trò chuyện
  const [hasSentFirstReply, setHasSentFirstReply] = useState(false);


    // Khởi tạo cuộc trò chuyện mới
  const handleNewChat = () => {
    setMessages([
      {
        sender: "bot",
        content: "Xin chào! Bạn muốn được tư vấn gì hôm nay?",
        timestamp: new Date().toISOString(),
      },
    ]);
    localStorage.removeItem("chatMessages");
  };
   const [messages, setMessages] = useState<Message[]>([]);
  const handleQuickOption = (option: string) => {
    handleSendMessage(option); // Gửi trực tiếp nội dung
  };
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
if (saved !== null) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
      
        setMessages(parsed); // ✅ chỉ dùng nếu là mảng và có dữ liệu
        return;
      }
    } catch (e) {
      console.error("❌ Lỗi parse localStorage:", e);
    }
  }

  // Nếu không có dữ liệu hoặc dữ liệu rỗng => gọi API
  fetchFirstPage();

  }, []);
  // State quản lý tin nhắn
 
  const fetchFirstPage = async () => {
    try {
      const res = await axiosInstance.get(`/messages?page=${page}&size=20`);
      const transformed = res.data.data.messages.map((msg: any) => ({
        sender: msg.sender_id === "admin_000" ? "bot" : "user",
        content: msg.content,
        timestamp: msg.time_send,
        images:
          Array.isArray(msg.images) && msg.images.length > 0
            ? msg.images.map(
                (imgObj: any) => "http://localhost:8000/" + imgObj.image_url,
              )
            : undefined,
      }));
      setThreadId(res.data.data.messages[0].thread_id); // Lưu thread_id từ phản hồi
      // Sắp xếp lại tin nhắn theo timestamp
      const sortedMessages = transformed.sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      setHasMore(Math.ceil(res.data.data.messages_count / 20));
      if(sortedMessages.length > 0) {
      // Cập nhật lại toàn bộ tin nhắn đã sắp xếp
      setMessages(sortedMessages);
      
      }
      else{
      handleNewChat();
      }
    } catch (err) {
      handleNewChat();  }
  };
  // Tải thêm tin nhắn khi cuộn
  const loadMoreMessages = async () => {
    const nextPage = page + 1;
    if (
      isFetchingRef.current ||
      page >= hasMore ||
      fetchedPages.current.has(nextPage)
    )
      return;
    isFetchingRef.current = true;
    fetchedPages.current.add(nextPage);

    try {
      const res = await axiosInstance.get(`/messages?page=${nextPage}&size=20`);
      const newMessages = res.data?.data.messages || [];

      if (newMessages.length === 0) return;

      const transformed = newMessages.map((msg: any) => ({
        sender: msg.sender_id === "admin_000" ? "bot" : "user",
        content: msg.content,
        timestamp: msg.time_send,
        images:
          Array.isArray(msg.images) && msg.images.length > 0
            ? msg.images.map(
                (imgObj: any) => "http://localhost:8000/" + imgObj.image_url,
              )
            : undefined,
      }));
      const container = chatContainerRef.current;
      const oldScrollHeight = container?.scrollHeight || 0;

      setMessages((prev) => {
        const merged = [...transformed, ...prev];
        return merged.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
      });
      setTimeout(() => {
        const newHeight = container?.scrollHeight || 0;
        if (container) {
          container.scrollTop += newHeight - oldScrollHeight;
        }
      }, 50);

      setpage(nextPage);
    } catch (err) {
      console.error("Lỗi khi load thêm tin nhắn:", err);
    } finally {
      isFetchingRef.current = false; // 🧠 mở lại sau khi tải xong
    }
  };

  // Lắng nghe sự kiện cuộn để tải thêm tin nhắn
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isFetchingRef.current || page >= hasMore) return;
      if (container.scrollTop < 20) {
        console.log("Cuộn lên trên, tải thêm tin nhắn...");

        loadMoreMessages();
      }
      // Nếu cuộn lên trên thì không tự động cuộn xuống dưới
      if (container.scrollTop > 100) {
        setShouldScrollToBottom(false); // Đặt `shouldScrollToBottom` là false khi người dùng cuộn lên
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

  // Cập nhật thời điểm đọc tin nhắn
  const [lastReadTime, setLastReadTime] = useState<string>(() => {
    return localStorage.getItem("lastReadTime") || "";
  });

  // Tự động cuộn xuống dưới mỗi khi có tin nhắn mới
  useEffect(() => {
    if (shouldScrollToBottom) {
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [messages, shouldScrollToBottom]);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("#menu-toggle-button")
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lưu tin nhắn vào localStorage khi tin nhắn thay đổi
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Khi chatbot được bật, reset trang và tải tin nhắn mới
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        isFirstScroll.current = false;
      }, 300);
    }
  }, [isVisible]);

  // Lắng nghe tin nhắn mới từ Pusher
  useEffect(() => {
    const handleNewMessage = (event: any) => {
      const data = event.data || event;

      console.log("🔔 New message from Pusher", data);

      const messageData = data.content;
      const newMsg: Message = {
        sender: messageData.sender_id === "admin_000" ? "bot" : "user",
        content: messageData.content,
        timestamp: messageData.time_send,
        images:
          Array.isArray(messageData.images) && messageData.images.length > 0
            ? messageData.images.map(
                (imgObj: any) => "http://localhost:8000/" + imgObj.image_url,
              )
            : undefined,
      };

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.content === newMsg.content &&
            msg.timestamp === newMsg.timestamp &&
            msg.sender === newMsg.sender &&
            JSON.stringify(msg.images) === JSON.stringify(newMsg.images),
        );
        if (isDuplicate) return prev;
        return [...prev, newMsg];
      });

      setShouldScrollToBottom(true);
    };

    channel.bind("MessageCreated", handleNewMessage);

    return () => {
      channel.unbind("MessageCreated", handleNewMessage);
    };
  }, []);

  // Xử lý gửi tin nhắn
  const [waitingForFieldName, setWaitingForFieldName] =
    useState<boolean>(false);
const formatTimeRange = (date_start: string, date_end: string): string => {
  const start = new Date(date_start).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(date_end).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${start} - ${end}`;
};
  const handleSendMessage = async (customInput?: string) => {
    const messageToSend = (customInput ?? input).trim();
    // Không gửi nếu không có gì cả
    if (!messageToSend && selectedImages.length === 0) return;

    const lowered = messageToSend.toLowerCase();
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        content: messageToSend || undefined,
        images: selectedImages.length > 0 ? [...selectedImages] : undefined,
        timestamp: new Date().toISOString(),
      },
    ]);
    setShouldScrollToBottom(true);
    setSelectedImages([]); // ✅ Reset ảnh sau khi gửi
    setInput(""); // Clear input

    // Xử lý trường hợp đang chờ người dùng nhập tên sân
    if (waitingForFieldName) {
      try {
        const response = await axiosInstance.get(
          `/fields/search?keyword=${messageToSend}`,
        );
        const fields = (response.data?.data as Field[] || []).filter(item => item.state.id === 'state-001');

        if (fields.length === 0) {
          const errorMessage: Message = {
            sender: "bot",
            content: "🙁 Không có sân nào trùng từ khóa. Bạn thử lại nhé!",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setWaitingForFieldName(false);
          setShouldScrollToBottom(true);
          return;
        } else {
          const productMessage: Message = {
            sender: "bot",
            content: (
              <div className="w-full">
                {fields.length === 1 ? (
                  <div className="max-w-md mx-auto">
                    <Inforcard
                      image={fields[0].images?.[0]?.image_url || "/default.jpg"}
                      name={fields[0].name}
                      soluong={fields[0].category?.name}
                      vitri={fields[0].address}
                      price={
                        Number(fields[0].price).toLocaleString("vi-VN") + " đ"
                      }
                      fieldId={fields[0].id}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {fields.map((field: any, idx: number) => (
                      <Inforcard
                        key={idx}
                        image={field.images?.[0]?.image_url || "/default.jpg"}
                        name={field.name}
                        soluong={field.category?.name}
                        vitri={field.address}
                        price={
                          Number(field.price).toLocaleString("vi-VN") + " đ"
                        }
                        fieldId={field.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, productMessage]);
          setShouldScrollToBottom(true);
        }
      } catch (error) {
        console.error("Lỗi khi tìm sân:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content: "Có lỗi xảy ra khi tìm sân. Vui lòng thử lại sau.",
            timestamp: new Date().toISOString(),
          },
        ]);
        setShouldScrollToBottom(true);
      } finally {
        setWaitingForFieldName(false);
      }
      return;
    }

    // Xử lý các trường hợp khác (đặt sân, lịch sử)
    if (lowered.includes("đặt sân") || lowered.includes("đặt sân bóng")) {
      setWaitingForFieldName(true);
      const fieldMessage: Message = {
        sender: "bot",
        content: `📍Bạn muốn đặt sân nào? Vui lòng nhập tên sân.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fieldMessage]);
      setShouldScrollToBottom(true);
      return;
    }

    if (lowered.includes("lịch sử") || lowered.includes("lịch sử đặt sân")) {
      try {
        const response = await axiosInstance.get("/bookings/user/today");
        const bookings = response.data?.data || [];
        console.log("Bookings:", bookings);
        if (bookings.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              content: "🕒 Bạn chưa có lịch sử đặt sân nào hôm nay.",
              timestamp: new Date().toISOString(),
            },
          ]);
          setShouldScrollToBottom(true);
          return;
        }

        const historyMessage: Message = {
          sender: "bot",
          content: (
            <div>
              <p className="font-semibold mb-2">📌 Lịch sử đặt sân hôm nay:</p>
              <div className="grid grid-cols-1 gap-3">
                {bookings.map((item: any, idx: number) => (
                  <HistoryCard
                    key={idx}
                    name={item.field.name}
                    address={item.field.address}
                    time={formatTimeRange(item.date_start,item.date_end)}
                  />
                ))}
              </div>
            </div>
          ),
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, historyMessage]);
        setShouldScrollToBottom(true);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt sân:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content: "❌ Lỗi khi lấy lịch sử đặt sân. Vui lòng thử lại sau.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
      setShouldScrollToBottom(true);
      return;
    }
    if (messageToSend || selectedImages.length > 0) {
      try {
        const formData = new FormData();
        if (messageToSend) {
          formData.append("content", messageToSend);
        }
        formData.append("thread_id", thread_id);
        // Tải từ URL base64 => file blob để gửi đúng dạng multipart
        selectedImages.forEach((dataUrl, idx) => {
          const arr = dataUrl.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], `image-${Date.now()}-${idx}.jpg`, {
            type: mime,
          });
          formData.append("image[]", file);
        });

        const response = await axiosInstance.post("/messages/send-message", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setThreadId(response.data.data.thread_id); // Cập nhật thread_id từ phản hồi

      if (!hasSentFirstReply) {
        const botReply: Message = {
          sender: "bot",
          content: (
            <div className="space-y-2">
              <p>🎉 Cảm ơn bạn! Mình sẽ sớm phản hồi yêu cầu của bạn.</p>
              <p className="font-semibold">Bạn muốn làm gì tiếp theo?</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleQuickOption("đặt sân")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-left"
                >
                  ⚽ Đặt sân
                </button>
                <button
                  onClick={() => handleQuickOption("lịch sử")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-left"
                >
                  📜 Xem lịch sử đặt sân
                </button>
              </div>
            </div>
          ),
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botReply]);
        setShouldScrollToBottom(true);
        setHasSentFirstReply(true); // Đánh dấu đã gửi phản hồi đầu tiên
      }

      } catch (err) {
        console.error("Gửi tin nhắn lỗi:", err);
      }
    }
  };


  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const selectedImagesRef = useRef<string[]>([]); // ✅ ref đồng bộ
  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  const handleImageUpload = (files: File[]) => {
    const maxAllowed = 4 - selectedImages.length;

    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("Một số ảnh vượt quá 2MB đã bị loại bỏ.");
      return;
    }

    if (validFiles.length > maxAllowed) {
      alert(`Bạn chỉ có thể chọn thêm tối đa ${maxAllowed} ảnh.`);
      return;
    }

    const readers: Promise<string>[] = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imageUrls) => {
      const newImages: string[] = [];
      const duplicates: string[] = [];

      imageUrls.forEach((url) => {
        if (selectedImages.includes(url)) {
          duplicates.push(url);
        } else {
          newImages.push(url);
        }
      });

      if (duplicates.length > 0) {
        alert("Một số ảnh đã được chọn trước đó và sẽ không được thêm lại.");
      }

      if (newImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`fixed bottom-20 right-6 w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50 transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
    >
      <Header
        onClose={onClose}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        menuRef={menuRef}
        handleQuickOption={handleQuickOption}
      />
      <MessageList
        messages={messages}
        loadMoreMessages={loadMoreMessages}
        endOfMessagesRef={endOfMessagesRef}
        chatContainerRef={chatContainerRef}
        isVisible={isVisible}
      />

      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2">
          {selectedImages.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20">
              <img
                src={img}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-xs hover:bg-red-500 hover:text-white"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default ChatBot;
