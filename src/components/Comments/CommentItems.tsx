import * as React from "react";
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Comment } from "../../types/comment";
import { useToast } from "../../hooks/use-toast";

interface CommentItemProps extends Comment {
  onCommentUpdated?: (updatedComment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  user_id,
  content,
  fieldId,
  id,
  createdAt,
  user,
  image_url,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [showOldImage, setShowOldImage] = useState(true);

  const toast = useToast();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", editedContent);
      if (newImage) {
        formData.append("image", newImage);
      }
      if (!showOldImage) {
        formData.append("image_status", "1");
      } else {
        formData.append("image_status", "0");
      }
      console.log("FormData:", formData.get("content"));
      console.log("FormDataimage:", formData.get("image"));

      const response = await axiosInstance.post(
        `/comment/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.toast({
        variant: "success",
        title: "Thành công!",
        description: "Bình luận đã được cập nhật.",
      });

      const updatedComment = response.data.data;
      if (onCommentUpdated) {
        onCommentUpdated(updatedComment);
      }

      setIsEditing(false);
      setNewImage(null);
      setPreviewImageUrl(null);
      setShowOldImage(true);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      toast.toast({
        variant: "destructive",
        title: "Lỗi",
        description: backendMessage,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/comment/${id}`);
      toast.toast({
        variant: "success",
        title: "Thành công!",
        description: "Bình luận đã được xóa.",
      });
      if (response.data.message === "Thành công!") {
        if (onCommentDeleted) {
          onCommentDeleted(id);
        }
        setShowConfirm(false);
      }
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      toast.toast({
        variant: "destructive",
        title: "Lỗi",
        description: backendMessage,
      });
    }
  };

  return (
    <article className="flex flex-col items-start w-full mb-4">
      <div className="flex flex-col items-start px-12 pt-4 pb-2 mt-10 ml-14 w-full font-semibold bg-zinc-300 max-w-[780px] rounded-[50px] max-md:px-5 max-md:max-w-full">
        {isEditing ? (
          <>
            <textarea
              className="w-full p-2 rounded resize-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            {/* Image section */}
            <div className="flex items-center gap-4 mt-2">
              {showOldImage && image_url && (
                <div className="relative">
                  <img
                    src={`http://localhost:8000/${image_url}`}
                    alt="Ảnh cũ"
                    className="w-32 h-32 object-cover rounded shadow-md"
                  />
                  <button
                    onClick={() => setShowOldImage(false)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-center"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="relative">
                {previewImageUrl && (
                  <img
                    src={previewImageUrl}
                    alt="Ảnh mới"
                    className="w-32 h-32 object-cover rounded shadow-md"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewImage(file);
                      setPreviewImageUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

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
                  setNewImage(null);
                  setPreviewImageUrl(null);
                  setShowOldImage(true);
                }}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-lg font-semibold mb-2">{user?.name || "Người dùng"}</h4>
            <p className="text-base text-black mb-2">{content}</p>
            {image_url && (
              <div className="w-full mb-2">
                <img
                  src={`http://localhost:8000/${image_url}`}
                  alt="Image comment"
                  className="w-32 h-32 object-cover rounded shadow-md"
                />
              </div>
            )}
            <div className="flex gap-1 mt-3 text-xs text-stone-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9cec473df0839e3f3c4212b90778e9706f278e9"
                alt="Calendar icon"
                className="object-contain shrink-0 aspect-[1.05] w-[21px]"
              />
              <time className="text-gray-600">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString()
                  : "Invalid Date"}
              </time>
            </div>
          </>
        )}
      </div>

      {String(currentUser?.id) === String(user_id) && (
        <div className="flex gap-3 mt-5 ml-14 justify-end w-[85%]">
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
