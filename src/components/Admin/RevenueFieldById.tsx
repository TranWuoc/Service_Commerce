import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import { fetchRevenueReport } from "../../api/revenueApi";
import { toast } from "../../hooks/use-toast";

// Định dạng tiền tệ
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);

const timeSlots = [
  { value: "06:00:00-08:00:00", label: "6:00 - 8:00" },
  { value: "08:00:00-10:00:00", label: "08:00 - 10:00" },
  { value: "10:00:00-12:00:00", label: "10:00 - 12:00" },
  { value: "14:00:00-16:00:00", label: "14:00 - 16:00" },
  { value: "16:00:00-18:00:00", label: "16:00 - 18:00" },
  { value: "18:00:00-20:00:00", label: "18:00 - 20:00" },
  { value: "20:00:00-22:00:00", label: "20:00 - 22:00" },
  { value: "22:00:00-00:00:00", label: "22:00 - 24:00" },
];

interface Booking {
  id: string;
  user_id: string;
  field: {
    id: string;
    name: string;
    price: number;
    address: string;
  };
  receipt: {
    id: string;
    total_price: number;
    deposit_price: number;
    is_fully_paid: number;
    status: string;
  };
  date_start: string;
  date_end: string;
}

interface RevenueReportData {
  total_revenue: number;
  bookings: Booking[];
  field?: {
    id: string;
    name: string;
    price: number;
    address: string;
  };
}

const RevenueFieldById = () => {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [reportData, setReportData] = useState<RevenueReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy ngày mặc định là đầu tháng đến hôm nay
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  }, []);

  // Fetch dữ liệu báo cáo
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !id) return;

      setLoading(true);
      setError(null);

      try {
        const [startTime, endTime] = selectedTimeSlot
          ? selectedTimeSlot.split("-")
          : ["", ""];

        const data = await fetchRevenueReport({
          field_id: id,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          start_time: startTime,
          end_time: endTime,
        });

        setReportData(data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, startDate, endDate, selectedTimeSlot]);

  const handleConfirmPayment = async (receiptId: string) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xác nhận thanh toán toàn bộ không?")
    ) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.post(
          `http://127.0.0.1:8000/api/receipts/confirm-full-payment/${receiptId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast({
          title: "Thành công",
          description: "Xác nhận thanh toán thành công",
          variant: "success",
        });

        // Refresh data after confirmation
        if (startDate && endDate && id) {
          const [startTime, endTime] = selectedTimeSlot
            ? selectedTimeSlot.split("-")
            : ["", ""];
          const data = await fetchRevenueReport({
            field_id: id,
            start_date: format(startDate, "yyyy-MM-dd"),
            end_date: format(endDate, "yyyy-MM-dd"),
            start_time: startTime,
            end_time: endTime,
          });
          setReportData(data);
        }
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description:
            error.response?.data?.message ||
            "Có lỗi xảy ra khi xác nhận thanh toán",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-2xl font-bold mb-4">
        Báo cáo doanh thu sân bóng
        {reportData?.field?.name && (
          <span className="ml-2 text-blue-600">- {reportData.field.name}</span>
        )}
      </h2>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Từ ngày:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground",
                )}
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
                onSelect={(date) => {
                  setStartDate(date ?? null);
                  setEndDate(null);
                  setSelectedTimeSlot(""); // Reset khung giờ khi đổi ngày
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Đến ngày:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "dd/MM/yyyy")
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => {
                  setEndDate(date ?? null);
                  setSelectedTimeSlot(""); // Reset khung giờ khi đổi ngày
                }}
                autoFocus
                hidden={startDate ? { before: startDate } : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Chỉ hiện khung giờ khi đã chọn ngày bắt đầu và kết thúc */}
        {startDate && endDate && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Khung giờ:</span>
            <Select
              value={selectedTimeSlot}
              onValueChange={setSelectedTimeSlot}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Chọn khung giờ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Khung giờ</SelectLabel>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Chỉ hiện dữ liệu khi đã chọn khung giờ */}
      {selectedTimeSlot && reportData && (
        <>
          {reportData.bookings ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="text-lg font-semibold p-4 border-b">
                Doanh thu {reportData.bookings[0].field.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khung giờ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá sân
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiền cọc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng thanh toán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Xác nhận
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(booking.date_start), "dd/MM/yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(booking.date_start), "HH:mm")} -{" "}
                            {format(new Date(booking.date_end), "HH:mm")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(booking.field.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(booking.receipt.deposit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(booking.receipt.total_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          booking.receipt.is_fully_paid === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                          >
                            {booking.receipt.is_fully_paid === 1
                              ? "Đã thanh toán toàn bộ"
                              : "Đã thanh toán cọc"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.receipt.is_fully_paid === 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleConfirmPayment(booking.receipt.id)
                              }
                            >
                              Xác nhận
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Không có dữ liệu đặt sân trong khoảng thời gian này
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueFieldById;
