import axiosInstance from "./axiosInstance";

// Hàm lấy doanh thu theo sân
export const fetchRevenueByField = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/statistics/revenue-by-field", {
      params: {
        start_date: "2025-01-01",
        end_date: "2025-12-31",
      },
    });
    return response.data.data; // Trả về dữ liệu doanh thu
} catch (error: any) {
    if (error.response) {
      console.error("❌ Lỗi từ server:", error.response.data);
    } else {
      console.error("❌ Lỗi không xác định:", error.message);
    }
    throw error;
  }
};