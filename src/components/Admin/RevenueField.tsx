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
import { vi } from "date-fns/locale";
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

    // Kiểm tra nếu cùng ngày
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    // Tạo timestamp
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (isSameDay) {
      // Nếu cùng ngày: 00:00:00 đến 23:59:59
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    } else {
      // Nếu khác ngày: giữ nguyên thời gian (hoặc set mặc định)
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }

    const params = {
      start_date: startDateTime.toISOString(),
      end_date: endDateTime.toISOString(),
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

  // Tính toán dữ liệu phân trang
  const totalItems = revenueData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const currentItems = revenueData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

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
              {startDate ? format(startDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                setStartDate(date ?? null);
                setCurrentPage(1);
              }}
              initialFocus
              locale={vi}
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
              onSelect={(date) => {
                setEndDate(date ?? null);
                setCurrentPage(1);
              }}
              initialFocus
              fromDate={startDate || undefined}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg w-full">
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
                Giá thuê
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={item.field_id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * rowsPerPage + index + 1}
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
      {totalItems > 0 && (
        <div className="flex items-center justify-center w-full px-6 py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage ? "bg-blue-600 text-white" : ""
                    }
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {revenueData.length > 0 && (
        <div className="flex justify-center w-full">
          <div className="bg-slate-50 px-4 py-3 rounded-lg mb-3">
            <p className="text-sm text-gray-600">
              <span className="text-3xl font-semibold">Tổng cộng:</span>{" "}
              <span className="text-3xl font-bold text-blue-500 ">
                {formatCurrency(
                  revenueData.reduce(
                    (sum, item) => sum + item.total_revenue,
                    0,
                  ),
                )}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueField;