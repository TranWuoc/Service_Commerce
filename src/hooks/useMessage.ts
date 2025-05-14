
import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { ApiResponse } from '../types/ApiResponse';
import { Thread } from "../types/Thread";
import { Message } from "../types/Message";

export const useMessage = () => {
  const toast = useToast();

  const getThreads = async (page: number, size: number): Promise<Thread[] | void> => {
    try {
      const response = await axiosInstance.get(`/threads/?page=${page}&size=${size}`);
      const res: ApiResponse<Thread[]> = response.data;
      return res.data;
    } catch (error: any) {
      console.error("Get threads error:", error.response?.data?.message || error.message);
      toast.toast({
        title: "Error",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  };

  const getThread = async (id: string, page: number, size: number): Promise<Thread | void > => {
    try {
        const response = await axiosInstance.get(`/threads/${id}?page=${page}&size=${size}`);
        const res: ApiResponse<Thread> = response.data;
        return res.data
      } catch (error: any) {
        console.error("Get messages error:", error.response?.data?.message || error.message);
        toast.toast({
          title: "Error",
          description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
      }
  }

  const sendMessageAPI = async (content: string, images: { link: string; file: File }[], thread_id: string): Promise<Message | void> => {
    try {
      const formData = new FormData();
      if (content)
        formData.append('content', content);
      formData.append('thread_id', thread_id);
      images.forEach((image) => {
        formData.append('image[]', image.file);
      });
  
      const response = await axiosInstance.post('/messages/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const res: ApiResponse<Message> = response.data;
      return res.data;
    } catch (error: any) {
      console.error("Send message error:", error.response?.data?.message || error.message);
      toast.toast({
        title: "Error",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  };

  const readThread = async (thread_id: string) => {
    try {
      return await axiosInstance.post('/messages/read', {thread_id});
    } catch (error: any) {
      console.error("Read messages error:", error.response?.data?.message || error.message);
      toast.toast({
        title: "Error",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  }

  return {getThreads, getThread, sendMessageAPI, readThread}
}