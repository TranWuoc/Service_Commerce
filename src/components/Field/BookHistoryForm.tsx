import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FieldsTable } from "../Field/FieldTable";
import { SearchBar } from "../Shared_components/SearchBar";
import { ConfirmModal } from "../Shared_components/ConfirmModal";

const BookHistoryForm: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [allRows, setAllRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const toISODateTime = (datetimeStr: string) => datetimeStr.replace(" ", "T");

  const formatDate = (datetimeString: string) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDisplayStatus = (booking: any) => {
    const receiptStatus = booking.receipt?.status;
    const isFullyPaid = booking.receipt?.is_fully_paid === 1;
    const bookingStatus = booking.booking_status;

    if (bookingStatus === "cancelled_by_user") return "Đã hủy";
    if (receiptStatus === "cancelled") return "Đã hủy";
    if (receiptStatus === "expired") return "Đã hết hạn";
    if (receiptStatus === "paid") return isFullyPaid ? "Đã thanh toán toàn bộ" : "Đã thanh toán cọc";
    if (receiptStatus === "pending") return "Chờ thanh toán";
    return "Không xác định";
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/user");
      const bookings = res.data.data.map((booking: any) => {
        const isoStart = toISODateTime(booking.date_start);
        const isoEnd = toISODateTime(booking.date_end);
        const dateStart = new Date(isoStart);
        const dateEnd = new Date(isoEnd);

        const displayStatus = getDisplayStatus(booking);

        return {
          id: booking.id,
          name: booking.field.name,
          rawDate: isoStart,
          date: formatDate(isoStart),
          timeRange: `${formatTime(dateStart)} - ${formatTime(dateEnd)}`,
          price: booking.receipt.total_price,
          deposit_price: booking.receipt.deposit_price,
          displayStatus,
          receiptUrl: displayStatus === "Chờ thanh toán" ? booking.receipt?.payment_url : null,
          booking_status: booking.booking_status,
        };
      });

      setAllRows(bookings);
      setFilteredRows(bookings);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đặt sân:", err);
    }
  };

  const toEndOfDay = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();

    const result = allRows.filter((r) => {
      const matchKeyword = r.name.toLowerCase().includes(keyword);

      const bookingDate = new Date(r.rawDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? toEndOfDay(endDate) : null;

      const matchStart = start ? bookingDate >= start : true;
      const matchEnd = end ? bookingDate <= end : true;

      return matchKeyword && matchStart && matchEnd;
    });

    setFilteredRows(result);
    setCurrentPage(1);
  };

  const handleCancel = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!selectedId) return;
    try {
      await axiosInstance.delete(`/bookings/${selectedId}`);
      const updated = allRows.filter((r) => r.id !== selectedId);
      setAllRows(updated);
      setFilteredRows(updated);
    } catch (err) {
      console.error("Lỗi khi hủy đặt sân:", err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-nowrap gap-6 items-center">
        <div className="flex-[0_0_53%] min-w-[280px] h-[70px]">
          <SearchBar
            searchQuery={search}
            onInputChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex-[0_0_45%] min-w-[280px] h-[60px] flex items-center gap-4">
          <div className="flex items-center space-x-2 min-w-[120px] h-full">
            <label className="text-sm whitespace-nowrap">Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartDate(newStart);
                if (endDate && new Date(endDate) < new Date(newStart)) {
                  setEndDate("");
                }
              }}
              className="border rounded-[10px] px-3 py-2 text-sm h-4/5"
              max={endDate || undefined}
              style={{ minWidth: 0 }}
            />
          </div>

          <div className="flex items-center space-x-2 min-w-[120px] h-4/5">
            <label className="text-sm whitespace-nowrap">Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-[10px] px-3 py-2 text-sm h-full"
              min={startDate || undefined}
              style={{ minWidth: 0 }}
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 text-sm h-4/5"
            style={{ minWidth: 80 }}
          >
            Lọc
          </button>
        </div>
      </div>

      <FieldsTable rows={paginatedRows} onCancel={handleCancel} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      <ConfirmModal
        visible={showConfirm}
        title="Xác nhận hủy sân"
        message="Bạn có chắc chắn muốn hủy đặt sân này không?"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        onConfirm={confirmCancel}
        confirmText="Hủy đặt"
      />
    </div>
  );
};

export default BookHistoryForm;