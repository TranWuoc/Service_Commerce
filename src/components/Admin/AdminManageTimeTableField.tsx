import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isBefore,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";
import { toast } from "../../hooks/use-toast";

interface TimeSlot {
  id: string;
  status: "active" | "inactive";
  price: number;
  note: string;
  isBooked: boolean;
  start_time: string;
  end_time: string;
  isManualInactive?: boolean;
}

interface TimeSlotUpdateResponse {
  message: string;
  data: {
    id: string;
    field_id: string;
    date: string;
    start_time: string;
    end_time: string;
    status: "active" | "inactive";
    price: number;
    updated_at: string;
  };
}

interface DaySchedule {
  day: string;
  date: Date;
  timeSlots: TimeSlot[];
}

const TimeTableField: React.FC = () => {
  const { id: fieldId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    dayIndex: number;
    slotIndex: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldPrice, setFieldPrice] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any>(null);

  // Lấy thông tin sân khi fieldId thay đổi
  useEffect(() => {
    const fetchFieldInfo = async () => {
      if (fieldId) {
        try {
          const res = await axiosInstance.get(`/fields/${fieldId}`);
          setFieldName(res.data.data.name);
          setFieldPrice(res.data.data.price || 0);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sân:", error);
          navigate("/admin/manage");
        }
      }
    };
    fetchFieldInfo();
  }, [fieldId, navigate]);

  // Lấy dữ liệu weekly pricing
  useEffect(() => {
    if (startDate && fieldId) {
      const fetchWeeklyPricing = async () => {
        setIsLoading(true);
        try {
          const selectedDate = format(startDate, "yyyy-MM-dd");
          const response = await axios.get(
            `http://localhost:8000/api/weekly-pricing/${fieldId}?selected_date=${selectedDate}`,
          );
          setWeeklyData(response.data);
          processWeeklyData(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu giá theo tuần:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWeeklyPricing();
    }
  }, [startDate, fieldId]);

  const sortTimeSlots = (slots: TimeSlot[]) => {
    return slots.sort((a, b) => {
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    });
  };

  // Xử lý dữ liệu weekly pricing
  const processWeeklyData = (data: any) => {
    const weekStart = new Date(data.start_of_week);
    const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
      addDays(weekStart, i),
    );
    const dayNames = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ];
    const now = new Date();

    const newSchedule = daysOfWeek.map((date, index) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = data.days[dateStr] || [];

      // Tạo timeSlots từ dữ liệu API
      const timeSlots = sortTimeSlots(
        dayData.map((slot: any) => {
          const startHour = parseInt(slot.start_time.split(":")[0]);
          const slotTime = new Date(date);
          slotTime.setHours(startHour, 0, 0, 0);

          const isPastSlot =
            (isBefore(date, now) && !isSameDay(date, now)) ||
            (isSameDay(date, now) && isBefore(slotTime, now));

          return {
            id: slot.time_slot_id,
            status: isPastSlot ? "inactive" : slot.status,
            price: slot.price,
            note: "",
            isBooked: slot.booked,
            start_time: slot.start_time,
            end_time: slot.end_time,
          };
        }),
      );

      return {
        day: dayNames[index],
        date,
        timeSlots,
      };
    });

    setSchedule(newSchedule);
  };

  // Cập nhật slot lên server
  const updateTimeSlot = async (
    date: Date,
    timeSlot: TimeSlot,
  ): Promise<TimeSlotUpdateResponse["data"]> => {
    try {
      const dateStr = format(date, "yyyy-MM-dd");

      const payload = {
        field_id: fieldId,
        date_start: `${dateStr}T${timeSlot.start_time}`,
        date_end: `${dateStr}T${timeSlot.end_time}`,
        price: timeSlot.price,
        status: timeSlot.status,
        custom_price: timeSlot.price,
      };
      const res = await axiosInstance.put<TimeSlotUpdateResponse>(
        "/field-time-slots/update-by-date",
        payload,
      );

      if (res.status === 200 && res.data.message === "Cập nhật thành công") {
        return res.data.data;
      }
      throw new Error(res.data.message || "Cập nhật thất bại");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", {
        error: error instanceof Error ? error.message : error,
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
      });
      throw error;
    }
  };

  const handleCellClick = (dayIndex: number, slotIndex: number) => {
    const slot = schedule[dayIndex].timeSlots[slotIndex];
    const date = schedule[dayIndex].date;
    if (
      slot.status === "inactive" &&
      !slot.isManualInactive &&
      isTimePassed(date, slot.start_time)
    ) {
      return;
    }

    setCurrentEdit({ dayIndex, slotIndex });
    setSelectedSlot({ ...slot });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (currentEdit && selectedSlot) {
      try {
        setIsLoading(true);

        await updateTimeSlot(schedule[currentEdit.dayIndex].date, {
          ...selectedSlot,
          isManualInactive: selectedSlot.status === "inactive",
        });

        if (startDate && fieldId) {
          const selectedDate = format(startDate, "yyyy-MM-dd");
          const response = await axios.get(
            `http://localhost:8000/api/weekly-pricing/${fieldId}?selected_date=${selectedDate}`,
          );
          setWeeklyData(response.data);
          processWeeklyData(response.data);
        }

        toast({
          title: "Thành công",
          description: "Cập nhật khung giờ thành công",
          variant: "success2",
        });

        setIsOpen(false);
      } catch (error) {
        console.error("Lỗi khi lưu thay đổi:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isTimePassed = (date: Date, startTime: string) => {
    const now = new Date();
    const slotDateTime = new Date(date);
    const [hours, minutes] = startTime.split(":").map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return isBefore(slotDateTime, now);
  };

  // Hàm lấy màu sắc cho ô
  const getCellColor = (slot: TimeSlot, basePrice: number) => {
    if (slot.isBooked) return "bg-purple-200";
    if (slot.status === "inactive" && !slot.isManualInactive)
      return "bg-gray-400";
    const ratio = slot.price / basePrice;
    if (ratio >= 1.5) return "bg-red-200";
    if (ratio >= 1.2) return "bg-orange-200";
    if (ratio === 1) return "bg-blue-200";
    return "bg-green-200";
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
  };

  const getTimeSlotHeaders = () => {
    if (schedule.length === 0 || schedule[0].timeSlots.length === 0) return [];

    const sortedSlots = [...schedule[0].timeSlots].sort((a, b) => {
      const timeToValue = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return timeToValue(a.start_time) - timeToValue(b.start_time);
    });

    return sortedSlots.map((slot) => ({
      start_time: slot.start_time,
      end_time: slot.end_time,
      id: slot.id,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khung giờ - {fieldName}</h1>
        <Button
          onClick={() => navigate("/admin/manage/FieldInfo/" + fieldId)}
          variant="outline"
        >
          Quay lại
        </Button>
      </div>

      <div className="flex justify-center mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-[180px] justify-start text-left font-normal"
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "dd/MM/yyyy")
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => setStartDate(date ?? null)}
              autoFocus
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-100">
                  Ngày/Giờ
                </th>
                {getTimeSlotHeaders().map((slot) => (
                  <th
                    key={slot.id}
                    className="border border-gray-300 p-2 bg-gray-100"
                  >
                    {formatTimeRange(slot.start_time, slot.end_time)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((daySchedule, dayIndex) => (
                <tr key={daySchedule.day}>
                  <td className="border text-center border-gray-300 p-2 bg-gray-50">
                    <div>{daySchedule.day}</div>
                    <div className="text-sm text-center text-gray-500">
                      {format(daySchedule.date, "dd/MM")}
                    </div>
                  </td>
                  {daySchedule.timeSlots.map((slot, slotIndex) => (
                    <td
                      key={slot.id}
                      className={`border text-center font-bold border-gray-300 p-2 ${
                        (slot.status === "inactive" &&
                          !slot.isManualInactive) ||
                        slot.isBooked
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } hover:opacity-80 ${getCellColor(slot, fieldPrice)}`}
                      onClick={() => handleCellClick(dayIndex, slotIndex)}
                      title={
                        slot.isBooked
                          ? "Đã đặt"
                          : slot.status === "inactive"
                            ? slot.isManualInactive
                              ? "Đã tắt thủ công"
                              : "Đã quá thời gian"
                            : `${slot.price.toLocaleString()} VND (${(slot.price / fieldPrice).toFixed(1)}x giá gốc)`
                      }
                    >
                      {slot.isBooked
                        ? "Đã đặt"
                        : slot.status === "active"
                          ? slot.price.toLocaleString()
                          : "✖"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup chỉnh sửa */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-xl font-bold mb-4">
              Chỉnh sửa khung giờ
            </Dialog.Title>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Trạng thái:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedSlot?.status === "active"}
                    onChange={() =>
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, status: "active" } : null,
                      )
                    }
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedSlot?.status === "inactive"}
                    onChange={() =>
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, status: "inactive" } : null,
                      )
                    }
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
            </div>

            {selectedSlot?.status === "active" && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Giá (VND):</label>
                <input
                  type="number"
                  value={selectedSlot?.price || 0}
                  onChange={(e) =>
                    setSelectedSlot((prev) =>
                      prev ? { ...prev, price: Number(e.target.value) } : null,
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TimeTableField;
