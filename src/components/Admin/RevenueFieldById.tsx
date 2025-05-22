import React, { useEffect, useState } from "react";
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
import { fetchRevenueByField } from "../../api/revenueApi";
import { RevenueByFieldItem } from "../../types/Field";

// Định dạng tiền tệ
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);

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

const RevenueFieldById = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [fieldData, setFieldData] = useState<RevenueByFieldItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy ngày mặc định là đầu tháng đến hôm nay
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  }, []);

  // Fetch dữ liệu sân theo id, ngày, khung giờ
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !id) return;
      setLoading(true);
      setError(null);
      try {
        const params = {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          field_id: id,
          time_slot: selectedTimeSlot || undefined,
        };
        // Giả sử API trả về mảng, lấy phần tử đầu tiên
        const data = await fetchRevenueByField(params);
        setFieldData(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, startDate, endDate, selectedTimeSlot]);

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
    <div className="flex flex-col gap-6 justify-center items-center">
      <h2 className="text-xl font-bold mb-2">Chi tiết doanh thu sân </h2>
      <div className="flex items-center gap-4 mb-4">
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
                {startDate ? format(startDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => {
                  setStartDate(date ?? null);
                  setEndDate(null);
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
                {endDate ? format(endDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => setEndDate(date ?? null)}
                autoFocus
                hidden={startDate ? { before: startDate } : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>
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
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá thuê (VND/giờ)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fieldData ? (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {fieldData.field.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {fieldData.field.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(fieldData.field.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatCurrency(fieldData.total_revenue)}
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu doanh thu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {fieldData && (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Tên sân:</span>
            <span className="col-span-3">{fieldData.field.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Địa chỉ:</span>
            <span className="col-span-3">{fieldData.field.address}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Giá thuê:</span>
            <span className="col-span-3">{formatCurrency(fieldData.field.price)}/giờ</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Tổng doanh thu:</span>
            <span className="col-span-3 font-semibold text-green-600">
              {formatCurrency(fieldData.total_revenue)}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Khoảng thời gian:</span>
            <span className="col-span-3">
              {format(startDate || new Date(), "dd/MM/yyyy")} -{" "}
              {format(endDate || new Date(), "dd/MM/yyyy")}
            </span>
          </div>
          {selectedTimeSlot && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Khung giờ:</span>
              <span className="col-span-3">{selectedTimeSlot}</span>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

export default RevenueFieldById;