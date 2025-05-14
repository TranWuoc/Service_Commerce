import axiosInstance from "./axiosInstance";
import { toast, useToast } from "../hooks/use-toast";
// Hàm lấy doanh thu theo sân
export const fetchRevenueByField = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/statistics/revenue-by-field", {
      params: {
        start_date: "2025-01-01",
        end_date: "2025-05-30",
      },
    });
    return response.data.data; // Trả về dữ liệu doanh thu
} catch (error: any) {
  toast({
    title: "Lỗi",
    description: error.message,
    variant: "destructive",
  });
}
};

export const fetchUntilDate = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/statistics/revenue-until-date?date=2025-06-30");
    return response.data.data; // Trả về dữ liệu doanh thu
  }
  catch (error: any) {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive",
    });
  }
};


export const fetchStatisticsActiveUsers = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.1:8000/api/statistics/top-users");
    return response.data.data; // Trả về dữ liệu doanh thu
  } catch (error: any) {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive",
    });
  }
};