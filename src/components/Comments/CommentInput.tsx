import React, { useState } from "react";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

interface CommentInputProps {
  fieldId: number;
  userId: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({ fieldId, userId }) => {
  const { fieldId: urlFieldId } = useParams(); // fallback nếu cần
  const [comment, setComment] = useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSendComment = async () => {
    if (!comment.trim()) {
      alert("Bình luận không thể để trống!");
      return;
    }

    try {
      await axiosInstance.post("/comment/create", {
        user_id: userId,
        field_id: fieldId || urlFieldId,
        content: comment,
        status: "active",
      });

      setComment(""); // reset sau khi gửi thành công
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="relative flex items-center justify-start px-7 pt-12 pb-5 mt-10 max-w-full bg-zinc-300 rounded-[50px] text-stone-300 w-[1143px] h-[200px] max-md:px-5">
      <div className="absolute left-7 top-1/2 -translate-y-1/2 w-[600px] h-[130px]">
        <InputField
          label=""
          type="text"
          placeholder="Viết bình luận của bạn ..."
          value={comment}
          onChange={handleCommentChange}
          style={{
            width: "100%",
            height: "100%",
            fontSize: "1.2rem",
            padding: "15px 20px",
            borderRadius: "1rem",
          }}
        />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2">
        <Button
          text="Gửi"
          type="tertiary"
          onClick={handleSendComment}
          customStyle={{
            width: "90px",
            height: "90px",
            borderRadius: "100%",
            padding: "0",
            backgroundSize: "50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
};
