import axios from "axios";
import { toast } from "../hooks/use-toast";

// Hàm lấy doanh thu theo sân
export const fetchRevenueByField = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get("http://127.0.0.1:8000/api/statistics/revenue-by-field", {
      params: {
        start_date: params?.start_date || "2025-01-01",
        end_date: params?.end_date || "2025-12-31",
      },
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem('authToken');
    const response = await axios.get("http://127.0.0.1:8000/api/statistics/revenue-until-date", {
      params: {
        date: "2025-06-30"
      },
      headers: {
        Authorization: `Bearer ${token}`,
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

export const fetchStatisticsActiveUsers = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get("http://127.0.0.1:8000/api/statistics/top-users", {
      headers: {
        Authorization: `Bearer ${token}`,
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