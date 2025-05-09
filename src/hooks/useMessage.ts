
import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";

export const useMessage = () => {
  const toast = useToast();

  const getThreads = async (page, size) => {
    try {
      const response = await axiosInstance.get(`/threads/?page=${page}&size=${size}`);
      const { message, data } = response.data;
      return { message, data}
    } catch (error: any) {
      console.error("Get threads error:", error.response?.data?.message || error.message);
      toast.toast({
        title: "Error",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  };

  const getThread = async (id, page, size) => {
    try {
        const response = await axiosInstance.get(`/threads/${id}?page=${page}&size=${size}`);
        const { message, data } = response.data;
        return { message, data}
      } catch (error: any) {
        console.error("Get messages error:", error.response?.data?.message || error.message);
        toast.toast({
          title: "Error",
          description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
      }
  }

  const sendMessageAPI = async (content, thread_id) => {
      try {
        const response = await axiosInstance.post('/messages/send-message', {content, thread_id});
        const { message, data } = response.data;
        return { message, data }
      } catch (error: any) {
        console.error("Get messages error:", error.response?.data?.message || error.message);
        toast.toast({
          title: "Error",
          description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
      }
  }

  return {getThreads, getThread, sendMessageAPI}
}