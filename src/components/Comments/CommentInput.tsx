"use client";

import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";

export const CommentInput: React.FC = () => {
  const [comment, setComment] = React.useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSendComment = () => {
    console.log("Comment sent:", comment);
    setComment(""); // Reset comment field after sending
  };

  return (
    <section className="flex flex-wrap gap-4 self-end px-7 pt-12 pb-5 mt-10 max-w-full bg-zinc-300 rounded-[50px] text-stone-300 w-[1143px] max-md:px-5">
      <div className="flex-1">
        <InputField
          label=""
          type="text"
          placeholder="Viết bình luận của bạn ....."
          value={comment}
          onChange={handleCommentChange}
          style={{
            marginBottom: 0,
            width: "100%", // Chiều rộng đầy đủ
            height: "70px", // Tăng chiều cao
            fontSize: "1.2rem", // Tăng kích thước chữ
            padding: "10px 15px", // Thêm padding để nội dung thoải mái hơn
          }}
        />
      </div>
      <Button
        text="Gửi"
        type="tertiary"
        onClick={handleSendComment}
        customStyle={{
          width: "85px",
          height: "85px",
          borderRadius: "100%",
          padding: "0",
          backgroundSize: "50%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </section>
  );
};