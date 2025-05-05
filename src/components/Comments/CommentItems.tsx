import * as React from "react";
import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import axiosInstance from "../../api/axiosInstance";
import { Comment } from "../../types/comment";
import { User } from "../../types/user";

interface CommentItemProps extends Comment {
  onCommentUpdated?: (updatedComment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;  // Đảm bảo sử dụng ID đúng kiểu
}

export const CommentItem: React.FC<CommentItemProps> = ({
  user_id,
  content,
  status,
  field_id,
  id,
  created_at,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await axiosInstance.get(`/users/${user_id}`);
  //       setUser(res.data.data);
  //     } catch (error) {
  //       console.error("Không thể lấy thông tin người dùng:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, [user_id]);

  const handleEdit = async () => {
    try {
      const response = await axiosInstance.post(`/comment/update/${id}`, {
        content: editedContent,
      });
      
      const updatedComment = response.data.data;
      
      // Ensure we're passing a properly formatted comment object
      if (onCommentUpdated) {
        onCommentUpdated({
          ...updatedComment,
          field_id: field_id,
          id: id,
          user_id: user_id,
          created_at: created_at
        });
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/comment/${id}`);

      if (response.data.message === "Thành công!") {
        // Thực hiện xóa bình luận trong component cha
        if (onCommentDeleted) {
          onCommentDeleted(id); 
        }

        setShowConfirm(false);
      }
    } catch (err) {
      console.error("Không thể xóa bình luận:", err);
    }
  };

  return (
    <article className="flex flex-col items-start w-full">
      <div className="flex gap-6 items-center h-[45px] text-neutral-950">
        {!loading && user && (
          <UserProfile
            imageUrl={user.avatar || "default-avatar.jpg"}
            name={user.name}
            role={user.role || "Người dùng"}
          />
        )}
      </div>

      <div className="flex flex-col items-start px-12 pt-4 pb-2 mt-1.5 ml-14 w-full font-semibold bg-zinc-300 max-w-[780px] rounded-[50px] max-md:px-5 max-md:max-w-full">
        {isEditing ? (
          <>
            <textarea
              className="w-full p-2 rounded resize-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Lưu
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(content);
                }}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-base text-black">{content}</p>
            <div className="flex gap-1 mt-3 text-xs text-stone-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9cec473df0839e3f3c4212b90778e9706f278e9"
                alt="Calendar icon"
                className="object-contain shrink-0 aspect-[1.05] w-[21px]"
              />
              <time className="text-gray-600">{new Date(created_at).toLocaleDateString()}</time>
            </div>
          </>
        )}
      </div>

      {currentUser?.id === user_id && !isEditing && (
        <div className="flex gap-3 mt-2 ml-14 justify-end w-[85%]">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-500 hover:underline"
          >
            Sửa
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-red-500 hover:underline"
          >
            Xóa
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-4">Bạn có chắc chắn muốn xóa bình luận này không?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
