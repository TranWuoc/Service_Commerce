import axiosInstance from "./axiosInstance";
import { toast } from "../hooks/use-toast";
// Hàm lấy doanh thu theo sân
export const fetchRevenueByField = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/statistics/revenue-by-field", {
      params: {
        start_date: params?.start_date || "2025-01-01",
        end_date: params?.end_date || "2025-12-31",
      },
    });
    return response.data.data;
  } catch (error: any) {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive",
    });
    throw error;
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

