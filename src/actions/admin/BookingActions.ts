// src/api/adminBookingActions.ts
import axiosInstance from "../../api/axiosInstance";

export interface Booking {
  id: string;
  user_id: string;
  field: {
    id: string;
    name: string;
    address?: string;
    price?: number;
    description?: string;
  };
  date_start: string;
  date_end: string;
  created_at: string;
  receipt?: {
    total_price: number;
    deposit_price: number;
    status: string;
    payment_url: string;
    expired_at: string;
  };
}

export interface WeeklyBookingsResponse {
  bookings: Booking[];
  start_of_week?: string;
  end_of_week?: string;
}

export const fetchWeeklyBookings = async (
  date: string,
  fieldId: string
): Promise<WeeklyBookingsResponse> => {
  try {
    const res = await axiosInstance.get<WeeklyBookingsResponse>("/bookings/weekly", {
      params: {
        date,
        field_id: fieldId,
      },
    });
    
    if (!res.data || !res.data.bookings || !Array.isArray(res.data.bookings)) {
      throw new Error("Invalid response structure");
    }
    
    return {
      start_of_week: res.data.start_of_week,
      end_of_week: res.data.end_of_week,
      bookings: res.data.bookings
    };
    
  } catch (error) {
    console.error("Lỗi khi lấy lịch đặt theo tuần:", error);
    throw error;
  }
};

// export const fetchBookingDetails = async (bookingId: string): Promise<Booking> => {
//   try {
//     const res = await axiosInstance.get<{ data: Booking }>(`/bookings/${bookingId}`);
//     return res.data.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin booking:", error);
//     throw error;
//   }
// };

export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<Booking> => {
  try {
    const res = await axiosInstance.patch<{ data: Booking }>(
      `/bookings/${bookingId}/status`,
      { status }
    );
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái booking:", error);
    throw error;
  }
};