import * as React from "react";
import { CommentHeader } from "../components/Comments/CommentHeader";
import { CommentItem } from "../components/Comments/CommentItems";
import { CommentInput } from "../components/Comments/CommentInput";

export const Comment: React.FC = () => {
  return (
    <section className="overflow-hidden pb-6 bg-white border border-solid border-white border-opacity-0 rounded-[50px]">
    
      <div className="flex flex-col items-start pr-10 pl-4 mt-5 w-full max-md:pr-5 max-md:max-w-full">
        <CommentItem
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/837d7f25e2104c6c140b5a1ca2d15724d91bebb1?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
          name="Jonitha Roy"
          role="User"
          comment="Đã trải nghiệm sân bóng đã rất thích bla bla bla ,........."
          date="Feb 24"
        />
        <CommentItem
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/996ee84fe2bd40a922bcec24b939f78693303754?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
          name="Salman Faris"
          role="Admin"
          comment="Cảm ơn mọi người đã đánh giá tốt về sân, ....."
          date="Feb 30"
        />
        <CommentInput />
      </div>
    </section>
  );
};


