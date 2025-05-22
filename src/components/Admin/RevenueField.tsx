import React, { useEffect, useState } from "react";
import { fetchRevenueByField } from "../../api/revenueApi";
import { RevenueByFieldItem } from "../../types/Field";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "../../components/ui/select";

const RevenueField: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueByFieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedField, setSelectedField] = useState<RevenueByFieldItem | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStartDate, setDialogStartDate] = useState<Date | null>(null);
  const [dialogEndDate, setDialogEndDate] = useState<Date | null>(null);
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(firstDayOfMonth);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadData();
    }
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!startDate || !endDate) return;

      const params = {
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      };

      const data = await fetchRevenueByField(params);
      if (data) {
        setRevenueData(data);
      } else {
        setError("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      setError("Không thể tải dữ liệu doanh thu");
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Hàm rút gọn địa chỉ
  const shortenAddress = (address: string): string => {
    const parts = address.split(",");
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}`;
    }
    return address;
  };

  const handleRowClick = (field: RevenueByFieldItem) => {
    navigate(`/admin/statistic/revenue/${field.field_id}`);
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
    <div className="flex flex-col gap-6 justify-center items-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl text-center font-semibold">
          Thống kê doanh thu sân bóng theo tháng
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
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
                    onSelect={(date) => setEndDate(date ?? null)}
                    initialFocus
                    fromDate={startDate || undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
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
            {revenueData.length > 0 ? (
              revenueData.map((item, index) => (
                <tr
                  key={item.field_id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.field.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {shortenAddress(item.field.address)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.field.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(item.total_revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu doanh thu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {revenueData.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-blue-50 px-4 py-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Tổng cộng:</span>{" "}
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.total_revenue, 0),
              )}
            </p>
          </div>
        </div>
      )}

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedField && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Chi tiết doanh thu {selectedField.field.name}{" "}
                </DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về doanh thu của sân
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Từ ngày:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !dialogStartDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dialogStartDate ? (
                          format(dialogStartDate, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 ">
                      <Calendar
                        mode="single"
                        selected={dialogStartDate || undefined}
                        onSelect={(date) => setDialogStartDate(date ?? null)}
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
                          !dialogEndDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dialogEndDate ? (
                          format(dialogEndDate, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dialogEndDate || undefined}
                        onSelect={(date) => setDialogEndDate(date ?? null)}
                        hidden={
                          dialogStartDate
                            ? { before: dialogStartDate }
                            : undefined
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {dialogStartDate && dialogEndDate && (
                <div className="flex justify-center items-center gap-2 mt-4">
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
              {selectedTimeSlot && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Tên sân:</span>
                    <span className="col-span-3">
                      {selectedField.field.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Địa chỉ:</span>
                    <span className="col-span-3">
                      {selectedField.field.address}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Giá thuê:</span>
                    <span className="col-span-3">
                      {formatCurrency(selectedField.field.price)}/giờ
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Tổng doanh thu:</span>
                    <span className="col-span-3 font-semibold text-green-600">
                      {formatCurrency(selectedField.total_revenue)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">
                      Khoảng thời gian:
                    </span>
                    <span className="col-span-3">
                      {format(dialogStartDate || new Date(), "dd/MM/yyyy")} -{" "}
                      {format(dialogEndDate || new Date(), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default RevenueField;
