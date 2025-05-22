import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, isBefore, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import axiosInstance from "../../api/axiosInstance";
import { fetchWeeklyBookings } from "../../actions/admin/BookingActions";
import axios from "axios";
interface TimeSlot {
  id: string;
  status: "active" | "inactive";
  priceMultiplier: number;
  note: string;
  isBooked: boolean;
  customPrice?: number;
  start?: number;
  end?: number;
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
    custom_price: number;
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
  const timeSlots = [
    "6:00 - 8:00",
    "08:00 - 10:00",
    "10:00 - 12:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
    "22:00 - 24:00",
  ];

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

  // Hàm khởi tạo lịch trình
const initializeSchedule = (startDate: Date): DaySchedule[] => {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    const now = new Date();

    return daysOfWeek.map((date, index) => {
      const isPastDate = isBefore(date, now) && !isSameDay(date, now);

      return {
        day: dayNames[index],
        date,
        timeSlots: timeSlots.map((slot, slotIndex) => ({
          id: `${index}-${slotIndex}`,
          status: isPastDate ? "inactive" : "active",
          priceMultiplier: 1,
          customPrice: fieldPrice,
          note: "",
          isBooked: false,
        })),
      };
    });
  };

  // Cập nhật slot lên server
const updateTimeSlot = async (
  date: Date,
  timeSlot: TimeSlot,
  slotIndex: number
): Promise<TimeSlotUpdateResponse['data']> => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const [start, end] = timeSlots[slotIndex].split(' - ').map(t => t.padStart(5, '0'));

    // Gộp ngày và giờ thành dạng ISO: "YYYY-MM-DDTHH:mm:ss"
    const date_start = `${dateStr}T${start}:00`;
    const date_end = `${dateStr}T${end}:00`;

    const payload = {
      field_id: fieldId,
      date_start,
      date_end,
      custom_price: typeof timeSlot.customPrice === "number"
        ? timeSlot.customPrice
        : fieldPrice * timeSlot.priceMultiplier,
      status: timeSlot.status,
      // Nếu backend cần note thì giữ lại, không thì bỏ dòng này
      // note: timeSlot.note
    };

    console.log("Payload gửi lên server:", payload);

    const res = await axiosInstance.put<TimeSlotUpdateResponse>(
      "/field-time-slots/update-by-date",
      payload
    );

    if (res.status === 200 && res.data.message === "Cập nhật thành công") {
      return res.data.data;
    }
    throw new Error(res.data.message || "Cập nhật thất bại");
  } catch (error) {
    console.error("Lỗi khi cập nhật:", {
      error: error instanceof Error ? error.message : error,
      response: axios.isAxiosError(error) ? error.response?.data : undefined
    });
    throw error;
  }
};

  // Ánh xạ booking vào schedule
  const mapBookingsToSchedule = (schedule: DaySchedule[], bookings: any[]) => {
    const updatedSchedule = [...schedule];

    bookings.forEach(booking => {
      const startDate = parseISO(booking.date_start);
      const endDate = parseISO(booking.date_end);
      
      const dayIndex = updatedSchedule.findIndex(day => 
        isSameDay(day.date, startDate)
      );
      
      if (dayIndex !== -1) {
        const startHour = startDate.getHours();
        let slotIndex = -1;
        
        if (startHour >= 6 && startHour < 8) slotIndex = 0;
        else if (startHour >= 8 && startHour < 10) slotIndex = 1;
        else if (startHour >= 10 && startHour < 12) slotIndex = 2;
        else if (startHour >= 14 && startHour < 16) slotIndex = 3;
        else if (startHour >= 16 && startHour < 18) slotIndex = 4;
        else if (startHour >= 18 && startHour < 20) slotIndex = 5;
        else if (startHour >= 20 && startHour < 22) slotIndex = 6;
        else if (startHour >= 22 && startHour < 24) slotIndex = 7;
        
        if (slotIndex !== -1) {
          updatedSchedule[dayIndex].timeSlots[slotIndex] = {
            ...updatedSchedule[dayIndex].timeSlots[slotIndex],
            isBooked: true,
            note: `Đã đặt: ${booking.field?.name || 'Sân bóng'}`
          };
        }
      }
    });

    return updatedSchedule;
  };

  // Lấy dữ liệu booking
  useEffect(() => {
    if (startDate && fieldId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const dateStr = format(startDate, 'yyyy-MM-dd');
          const initialSchedule = initializeSchedule(startDate);
          
          const response = await fetchWeeklyBookings(dateStr, fieldId);
          const updatedSchedule = mapBookingsToSchedule(initialSchedule, response.bookings);
          
          setSchedule(updatedSchedule);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
          setSchedule(initializeSchedule(startDate));
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    }
  }, [startDate, fieldId]);

  const handleCellClick = (dayIndex: number, slotIndex: number) => {
    const slot = schedule[dayIndex].timeSlots[slotIndex];
    
    if (slot.status === "inactive" || slot.isBooked) {
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
        
        // Cập nhật lên server
        const updatedSlot = await updateTimeSlot(
          schedule[currentEdit.dayIndex].date,
          selectedSlot,
          currentEdit.slotIndex
        );

        // Cập nhật local state
        const updatedSchedule = [...schedule];
        updatedSchedule[currentEdit.dayIndex].timeSlots[currentEdit.slotIndex] = {
          ...selectedSlot,
          customPrice: updatedSlot.custom_price,
          status: updatedSlot.status
        };
        
        setSchedule(updatedSchedule);
        setIsOpen(false);
        
      } catch (error) {
        console.error("Lỗi khi lưu thay đổi:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };


  const getCellColor = (status: "active" | "inactive", multiplier: number, isBooked: boolean) => {
    if (isBooked) return "bg-purple-200";
    if (status === "inactive") return "bg-gray-200";

    switch (multiplier) {
      case 1:
        return "bg-green-200";
      case 1.5:
        return "bg-yellow-200";
      case 2:
        return "bg-orange-200";
      case 2.5:
        return "bg-red-200";
      default:
        return "bg-green-200";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Quản lý khung giờ
        </h1>
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
              initialFocus
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
                <th className="border border-gray-300 p-2 bg-gray-100">Ngày/Giờ</th>
                {timeSlots.map((time) => (
                  <th
                    key={time}
                    className="border border-gray-300 p-2 bg-gray-100"
                  >
                    {time}
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
                  {timeSlots.map((_, slotIndex) => {
                    const slot = daySchedule.timeSlots[slotIndex];
                    return (
                      <td
                        key={`${dayIndex}-${slotIndex}`}
                        className={`border text-center font-bold border-gray-300 p-2 ${slot.status === "inactive" || slot.isBooked ? 'cursor-not-allowed' : 'cursor-pointer'} hover:opacity-80 ${getCellColor(slot.status, slot.priceMultiplier, slot.isBooked)}`}
                        onClick={() => handleCellClick(dayIndex, slotIndex)}
                        title={slot.isBooked ? slot.note : ''}
                      >
                        {slot.isBooked ? "Đã đặt" : 
                         slot.status === "active" ? `x${slot.priceMultiplier}` : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup chỉnh sửa */}
       <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
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
                        prev ? { ...prev, status: "active" } : null
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
                        prev ? { ...prev, status: "inactive" } : null
                      )
                    }
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
            </div>

            {selectedSlot?.status === "active" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Hệ số giá:</label>
                  <select
                    value={selectedSlot?.priceMultiplier}
                    onChange={(e) =>
                      setSelectedSlot((prev) =>
                        prev
                          ? { 
                              ...prev, 
                              priceMultiplier: Number(e.target.value),
                              customPrice: fieldPrice * Number(e.target.value)
                            } 
                          : null
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="1">x1 (Giá gốc: {fieldPrice.toLocaleString()} VND)</option>
                    <option value="1.5">x1.5 ({(fieldPrice * 1.5).toLocaleString()} VND)</option>
                    <option value="2">x2 ({(fieldPrice * 2).toLocaleString()} VND)</option>
                    <option value="2.5">x2.5 ({(fieldPrice * 2.5).toLocaleString()} VND)</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Giá tùy chỉnh (VND):</label>
                  <input
                    type="number"
                    value={selectedSlot?.customPrice || fieldPrice * (selectedSlot?.priceMultiplier || 1)}
                    onChange={(e) =>
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, customPrice: Number(e.target.value) } : null
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Ghi chú:</label>
              <textarea
                value={selectedSlot?.note || ""}
                onChange={(e) =>
                  setSelectedSlot((prev) =>
                    prev ? { ...prev, note: e.target.value } : null
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>

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