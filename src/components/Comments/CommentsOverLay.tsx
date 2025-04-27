import React, { useEffect, useState } from "react";
import { CommentInput } from "../Comments/CommentInput";
import { CommentHeader } from "./CommentHeader";
import { CommentItem } from "./CommentItems";
import echo from "../../lib/echo"; // nhớ import Echo nè
import axiosInstance from "../../api/axiosInstance";
import { Comment } from "../../types/comment";

interface CommentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fieldInfo: any;
}

export const CommentOverlay: React.FC<CommentOverlayProps> = ({
  isOpen,
  onClose,
  fieldInfo,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};

  useEffect(() => {
    if (!isOpen) return;

    // 1. Lấy comment lần đầu
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/fields/${fieldInfo.id}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error("Lỗi fetch comments:", error);
      }
    };

    fetchComments();


    const channelName = `field.${fieldInfo.id}`;
    const channel = echo.channel(channelName);

    channel.listen(".CommentCreated", (e: any) => {
      setComments((prev) => [...prev, e.comment]);
    });

    channel.listen(".CommentUpdated", (e: any) => {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === e.comment.id ? { ...comment, content: e.comment.content } : comment
        )
      );
    });

    channel.listen(".CommentDeleted", (e: any) => {
      setComments((prev) => prev.filter((comment) => comment.id !== e.commentId));
    });

    // Cleanup khi đóng overlay
    return () => {
      echo.leave(channelName);
    };
  }, [isOpen, fieldInfo.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[60%] max-h-[90%] rounded-[20px] overflow-y-auto bg-white p-4">
        <CommentHeader onClose={onClose} fieldInfo={fieldInfo} />

        {/* Comment List */}
        <div className="flex flex-col gap-4 mt-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} {...comment} />
          ))}
        </div>

        {/* Input comment mới */}
        <CommentInput fieldId={fieldInfo.id} userId={parsedUser?.id || 0} />
      </div>
    </div>
  );
};
