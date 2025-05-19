import React from "react";
import { FaPaperPlane } from "react-icons/fa";

type Props = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleImageUpload?: (file: File[]) => void;
};

const ChatInput: React.FC<Props> = ({ input, setInput, handleSendMessage,handleImageUpload }) => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
      <label className="cursor-pointer">
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const file = Array.from(e.target.files || []);
          if (file && handleImageUpload) {
            handleImageUpload(file);
          }
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500 hover:text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7m-2 0l-6-4-6 4" />
      </svg>
    </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Nhập tin nhắn..."
          maxLength={500}
        />
        <button onClick={() => handleSendMessage()} className="bg-white p-3 rounded-full shadow hover:bg-gray-100">
          <FaPaperPlane size={20} className="text-yellow-500" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
