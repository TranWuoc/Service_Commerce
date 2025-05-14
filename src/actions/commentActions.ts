// src/actions/commentActions.ts
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../hooks/use-toast";

interface FetchCommentsOptions {
  page?: number;
  perPage?: number;
}

export async function fetchCommentsByField(
  fieldId: string,
  options: FetchCommentsOptions = {}
) {
  const { page = 1, perPage = 5 } = options;
  try {
    const response = await axiosInstance.get(`/comment/findByFieldId/${fieldId}`, {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải bình luận:", error);
    throw error;
  }
}

export const sendComment = async (
  userId: number,
  fieldId: number | string,
  comment: string,
  images: File[],
  toast: ReturnType<typeof useToast>
) => {
  if (images.length === 0) {
    toast.toast({
      variant: "destructive",
      title: "Lỗi",
      description: "Vui lòng thêm ảnh.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("user_id", userId.toString());
  formData.append("field_id", String(fieldId));
  formData.append("content", comment);
  formData.append("status", "active");

  // Thêm ảnh vào formData
  images.forEach((img) => {
    formData.append("image", img);
  });

  try {
    const response = await axiosInstance.post("/comment/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.toast({
      variant: "success",
      title: "Bình luận thành công",
      description: "Bình luận của bạn đã được gửi thành công!",
    });

    return response.data;
  } catch (error) {
    toast.toast({
      variant: "destructive",
      title: "Lỗi",
      description: error.response?.data?.message || "Đã xảy ra lỗi khi gửi bình luận.",
    });
    throw error;
  }
};
export async function updateComment(
  id: string,
  content: string,
  newImage: File | null,
  showOldImage: boolean,
  oldImageUrl: string | null,
  onSuccess: (updatedComment: Comment) => void,
  onError: (message: string) => void
) {
  const formData = new FormData();
  formData.append("content", content);
  if (newImage) {
    formData.append("image", newImage);
  }
  if (!showOldImage) {
    formData.append("image_status", "1");
  } else {
    formData.append("image_status", "0");
  }

  try {
    const response = await axiosInstance.post(`/comment/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedComment = response.data.data;
    onSuccess(updatedComment);
  } catch (err: any) {
    const backendMessage = err.response?.data?.message;
    onError(backendMessage);
  }
}

export async function deleteComment(
  id: string,
  onSuccess: () => void,
  onError: (message: string) => void
) {
  try {
    const response = await axiosInstance.delete(`/comment/${id}`);
    if (response.data.message === "Thành công!") {
      onSuccess();
    }
  } catch (err: any) {
    const backendMessage = err.response?.data?.message;
    onError(backendMessage);
  }
}