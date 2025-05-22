import React from "react";
import { Message } from "../../types/Bot";

type Props = {
  msg: Message;
};

const MessageItem: React.FC<Props> = ({ msg }) => {
  const isUser = msg.sender === "user";

  return (

    <div className={`${isUser ? "text-right" : "text-left"} my-2`}>
     

      {/* Hiển thị ảnh nếu có */}
{msg.images && msg.images.length > 0 && (
  <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className="grid grid-cols-2 gap-1"
      style={{
        direction: msg.sender === "user" ? "rtl" : "ltr",
        maxWidth: "170px",
      }}
    >
      {msg.images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`img-${idx}`}
          className="w-[80px] h-[80px] object-cover rounded-md border"
        />
      ))}
    </div>
  </div>
)}


 {/* Hiển thị nội dung nếu có */}
      {msg.content && (
     <div
        className={`inline-block px-3 py-2 rounded-lg break-words max-w-[80%] ${
          isUser ? "bg-yellow-500 text-white" : "bg-gray-200 text-black"
        } ${msg.images && msg.images.length > 0 ? "mt-2" : ""}`}
      >          {msg.content}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
