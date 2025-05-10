import React, { useEffect, useState, useCallback } from "react";
import { CommentInput } from "../Comments/CommentInput";
import { CommentHeader } from "./CommentHeader";
import { CommentItem } from "./CommentItems";
import echo from "../../lib/echo";
import axiosInstance from "../../api/axiosInstance";
import { Comment } from "../../types/comment";
import { useToast } from "../../hooks/use-toast";
interface CommentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fieldInfo: { id: string };
}

export const CommentOverlay: React.FC<CommentOverlayProps> = ({
  isOpen,
  onClose,
  fieldInfo,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchComments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/comment/findByFieldId/${fieldInfo.id}?page=${page}`,
        {
          params: {
            // Truyền số trang
            page,
            per_page: 5  // Truyền số bình luận mỗi trang, bạn có thể thay đổi giá trị này nếu muốn
          }
        }
      );

      setComments(res.data.data);
      setPagination({
        currentPage: res.data.meta.current_page,
        totalPages: res.data.meta.last_page
      });
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fieldInfo.id]);

    const handleNewComment = useCallback((e: any) => {
      const newComment = e.content;
      if (!newComment || newComment.fieldId !== fieldInfo.id) return;

      setComments(prev => {
        const exists = prev.some(c => c.id === newComment.id);
        return exists ? prev : [newComment, ...prev];
      });
    }, [fieldInfo.id]);

    const handleUpdatedComment = useCallback((e: any) => {
      const updatedComment = e.content;
   
      if (!updatedComment || updatedComment.fieldId !== fieldInfo.id) return;
      // Cập nhật bình luận trong danh sách
      setComments(prev =>
        prev.map(c => 
          c.id === updatedComment.id 
            ? { ...c, content: updatedComment.content, image_url: updatedComment.image_url } // Cập nhật ảnh
            : c
        )
      );
    }, [fieldInfo.id]);

  const handleDeletedComment = useCallback((e: any) => {
   
    const deletedCommentId = e.content;
    if (!deletedCommentId) return;

    setComments(prev => prev.filter(c => c.id !== deletedCommentId));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    fetchComments(1);

    const channel = echo.channel(`comments`);

    channel.listen('.CommentCreated', handleNewComment);
    channel.listen('.CommentUpdated', handleUpdatedComment);
    channel.listen('.CommentDeleted', handleDeletedComment);

    return () => {
      channel.stopListening('.CommentCreated', handleNewComment);
      channel.stopListening('.CommentUpdated', handleUpdatedComment);
      channel.stopListening('.CommentDeleted', handleDeletedComment);
      echo.leaveChannel('comments');
    };
  }, [isOpen, fieldInfo.id, fetchComments, handleNewComment, handleUpdatedComment, handleDeletedComment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative w-[60%] max-h-[90%] rounded-[20px] overflow-y-auto bg-opacity p-0">
        <CommentHeader  onClose={onClose} fieldInfo={fieldInfo} />
        
        <div className="flex flex-col gap-4  bg-white">
          {comments.map((comment) => (
            <CommentItem
              key={`${comment.id}-${comment.created_at}`}
              
              id={comment.id}
              content={comment.content}
              fieldIId={comment.fieldId}
              updatedAt={comment.updatedAt}
              image_url={comment.image_url}
              user={comment.user}
              user_id={comment.user?.id}  
              
              onCommentDeleted={(id) => setComments(prev => prev.filter(c => c.id !== id))}
            />
          ))}

          <div className="flex justify-center gap-4 py-2 bg-white">
            {pagination.currentPage > 1 && (
              <button
                onClick={() => fetchComments(pagination.currentPage - 1)}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Prev
              </button>
            )}

            <span className="flex items-center gap-2 text-sm text-gray-600">
              <span>{pagination.currentPage}</span> / <span>{pagination.totalPages}</span>
            </span>

            {pagination.currentPage < pagination.totalPages && (
              <button
                onClick={() => fetchComments(pagination.currentPage + 1)}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center  py-2 bg-white">
        <CommentInput 
          fieldId={fieldInfo.id} 
          userId={user?.id } 
        />
        </div>
      </div>
    </div>
  );
};
