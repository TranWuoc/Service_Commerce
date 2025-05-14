// src/actions/bookingActions.ts
import axiosInstance from "../api/axiosInstance";
import { TimeSlot } from "../types/Booking";

interface BookingData {
  field_id: string;
  date_start: string;
  date_end: string;
}

interface Field {
  id: number;
  name: string;
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

// Lấy ngày tối thiểu có thể đặt (5 ngày sau ngày hiện tại)
export const getMinBookingDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 5);
  return today.toISOString().split("T")[0];
};