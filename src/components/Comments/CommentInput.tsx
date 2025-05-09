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
    <section className="relative flex items-center justify-start px-7 pt-12 pb-5 mt-10 max-w-full bg-zinc-300 rounded-[50px] text-stone-300 w-[1143px] h-[200px] max-md:px-5">
      <div className="absolute left-7 top-1/2 -translate-y-1/2 w-[600px] h-[130px]">
        <InputField
          label=""
          type="text"
          placeholder="Viết bình luận của bạn ....."
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
    </section>
  );
};
