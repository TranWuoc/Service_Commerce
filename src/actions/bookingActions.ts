import axiosInstance from "../api/axiosInstance";
import { TimeSlot } from "../types/Booking";

export interface BookingData {
  field_id: string;
  date_start: string;
  date_end: string;
}

export interface Field {
  id: number;
  name: string;
}

interface WeeklyPricingTimeSlot {
  time_slot_id: string;
  start_time: string;
  end_time: string;
  price: number;
  status: string;
  is_override: boolean;
  booked: boolean;
}

interface WeeklyPricingResponse {
  start_of_week: string;
  end_of_week: string;
  days: {
    [date: string]: WeeklyPricingTimeSlot[];
  };
}

// Lấy danh sách sân bóng
export const fetchFields = async (): Promise<Field[]> => {
  try {
    const res = await axiosInstance.get("/fields");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sân:", error);
    throw error;
  }
};

// Tạo booking mới
export const createBooking = async (data: BookingData) => {
  try {
    const res = await axiosInstance.post("/bookings", data);
    return res.data;
  } catch (error) {
    console.error("Error submitting booking:", error);
    throw error;
  }
};

// Tạo dữ liệu booking từ form
export const prepareBookingData = (
  fieldId: string,
  date: string,
  timeSlotValue: string,
  timeSlots: TimeSlot[]
): BookingData | null => {
  const slot = timeSlots.find((s) => s.value === timeSlotValue);
  if (!slot || !date || !fieldId) return null;

  const base = new Date(date);
  const start = new Date(base);
  const end = new Date(base);
  start.setHours(slot.startHour, 0, 0, 0);
  end.setHours(slot.endHour, 0, 0, 0);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

  return {
    field_id: fieldId,
    date_start: fmt(start),
    date_end: fmt(end),
  };
};

// Lấy ngày tối thiểu có thể đặt (hôm nay, local time)
export const getMinBookingDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Kiểm tra ngày có hợp lệ (>= ngày hôm nay)
export const validateBookingDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const selectedDate = new Date(dateStr);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};
export const fetchWeeklyBookings = async (
  selectedDate: string,
  fieldId: string
): Promise<WeeklyPricingResponse> => {
  try {
    const res = await axiosInstance.get(`/weekly-pricing/${fieldId}`, {
      params: {
        selected_date: selectedDate,
      },
    });
    return res.data; // trả về toàn bộ response chứa days, start_of_week, end_of_week
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu giá theo tuần:", error);
    throw error;
  }
};