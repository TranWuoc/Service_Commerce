import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Shared_components/Button";
import { useToast } from "../../hooks/use-toast";
import { sendComment } from "../../actions/commentActions";

interface CommentInputProps {
  fieldId: number;
  userId: number;
  parentId?: string;
  isReply?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({ fieldId, userId, parentId, isReply }) => {
  const { fieldId: urlFieldId } = useParams();
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const toast = useToast();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const selected = files.slice(0, 3 - images.length);
    setImages((prev) => [...prev, ...selected]);

    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendComment = async () => {
    try {
      await sendComment(userId, fieldId || urlFieldId, comment, images, toast, parentId);
      setComment("");
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error("Lỗi khi gửi bình luận", error);
    }
  };

  return (
    <div
      className={`w-full max-w-4xl p-4 mt-4 rounded-xl shadow-sm border ${
        isReply ? "bg-white border-zinc-300 ml-10" : "bg-zinc-100 border-zinc-200 mt-10"
      }`}
    >
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Hãy chia sẻ cảm nhận của bạn..."
        rows={isReply ? 2 : 4}
        className={`w-full resize-none border rounded-xl p-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white placeholder-zinc-400 ${
          isReply ? "border-zinc-300" : "border-zinc-300"
        }`}
      />

      <div className="mt-3 flex flex-wrap gap-3">
        {previews.map((src, index) => (
          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
            <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length < 3 && (
          <label className="w-20 h-20 border border-dashed border-zinc-400 rounded-lg flex items-center justify-center text-zinc-500 cursor-pointer hover:border-amber-400 hover:text-amber-500 bg-white">
            +
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              multiple
            />
          </label>
        )}
      </div>

      <div className="flex justify-end mt-3">
        <Button
          text="Gửi"
          type="primary"
          onClick={handleSendComment}
          customStyle={{
            padding: isReply ? "8px 20px" : "12px 32px",
            borderRadius: "999px",
            fontWeight: 600,
            backgroundColor: "#f59e0b",
            color: "white",
            fontSize: isReply ? "0.875rem" : "1rem",
          }}
        />
      </div>
    </div>
  );
};
