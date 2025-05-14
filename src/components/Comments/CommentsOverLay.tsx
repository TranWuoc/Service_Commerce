import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CommentInput } from "../Comments/CommentInput";
import { CommentHeader } from "./CommentHeader";
import { CommentItem } from "./CommentItems";
import echo from "../../lib/echo";
import { Comment } from "../../types/comment";
import { useToast } from "../../hooks/use-toast";
import { fetchCommentsByField } from "../../actions/commentActions";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const navigate = useNavigate();
  const paginationRef = useRef(pagination);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchComments = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const { data, meta } = await fetchCommentsByField(fieldInfo.id, {
          page,
          perPage: 5,
        });
        setComments(data);
        setPagination({
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        });
        paginationRef.current = {
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        };
      } catch (error) {
        console.error("Failed to load comments:", error);
        setError("Failed to load comments. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fieldInfo.id]
  );

  const handleDeletedComment = useCallback(
    (deletedCommentId: string) => {
      setComments((prev) => {
        const updatedComments = prev.filter((c) => c.id !== deletedCommentId);

        if (updatedComments.length === 0) {
          if (paginationRef.current.currentPage === 1) {
            navigate(-1);
          } else if (
            paginationRef.current.currentPage === paginationRef.current.totalPages
          ) {
            fetchComments(paginationRef.current.currentPage - 1);
          }
        }

        return updatedComments;
      });
    },
    [navigate, fetchComments]
  );

  useEffect(() => {
    if (!isOpen) return;

    fetchComments(1);

    const channel = echo.channel(`comments`);
    channel.listen(".CommentCreated", (e: any) => {
      setComments((prev) => {
        if (paginationRef.current.currentPage === 1 && prev.length >= 5) {
          fetchComments(1);
          return prev;
        } else {
          return [e.content, ...prev];
        }
      });
    });
    channel.listen(".CommentUpdated", (e: any) => {
      setComments((prev) =>
        prev.map((c) => (c.id === e.content.id ? { ...c, ...e.content } : c))
      );
    });
    channel.listen(".CommentDeleted", (e: any) => handleDeletedComment(e.content));

    return () => {
      channel.stopListening(".CommentCreated");
      channel.stopListening(".CommentUpdated");
      channel.stopListening(".CommentDeleted");
      echo.leaveChannel("comments");
    };
  }, [isOpen, fetchComments, handleDeletedComment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative w-[60%] max-h-[90%] rounded-[20px] bg-opacity p-0">
        <CommentHeader onClose={onClose} fieldInfo={fieldInfo} />

        <div className="flex flex-col gap-4 bg-white">
          {comments.map((comment) => (
            <CommentItem
              key={`${comment.id}-${comment.created_at}`}
              id={comment.id}
              content={comment.content}
              fieldId={comment.fieldId}
              createdAt={comment.createdAt}
              image_url={comment.image_url}
              user={comment.user}
              user_id={comment.user?.id}
              onCommentDeleted={() => fetchComments(paginationRef.current.currentPage)}
            />
          ))}
        </div>

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

        <div className="flex justify-center py-2 bg-white">
          <CommentInput fieldId={fieldInfo.id} userId={user?.id} />
        </div>
      </div>
    </div>
  );
};
