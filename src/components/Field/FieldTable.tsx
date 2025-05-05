import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ConfirmModal } from "../Shared_components/ConfirmModal";

export const FieldsTable: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/user");
      const bookings = res.data.data;

      setRows(
        bookings.map((booking: any) => ({
          id: booking.id,
          name: booking.field.name,
          date: formatDate(booking.date_start),
          rawDate: booking.date_start,
          price: booking.field.price,
          status: "Đã thuê",
          review: "Chưa có đánh giá",
        }))
      );
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đặt sân:", err);
    }
  };

  const formatDate = (datetimeString: string) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCancelRequest = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axiosInstance.delete(`/bookings/${selectedId}`);
      setRows((prev) => {
        const newRows = prev.filter((row) => row.id !== selectedId);
        // nếu sau khi xóa mà trang hiện tại không đủ 5 mục thì cố gắng đẩy lên 1 mục từ trang sau
        const missing = itemsPerPage - newRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length;
        if (missing > 0 && currentPage < Math.ceil(newRows.length / itemsPerPage)) {
          const extra = newRows.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + missing);
          const result = [
            ...newRows.slice(0, currentPage * itemsPerPage),
            ...extra,
            ...newRows.slice(currentPage * itemsPerPage + missing),
          ];
          return result;
        }
        return newRows;
      });
    } catch (err) {
      console.error("Lỗi khi hủy đặt sân:", err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const isCancelable = (dateStr: string) => {
    const startDate = new Date(dateStr);
    const nowPlus2Days = new Date();
    nowPlus2Days.setDate(nowPlus2Days.getDate() + 2);
    return startDate > nowPlus2Days;
  };

  return (
    <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full h-[500px]">
      <div className="grid px-0 py-4 text-base font-semibold border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] text-slate-400 max-sm:gap-2 max-sm:grid-cols-[1fr]">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Tổng giá</div>
        <div>Đánh giá</div>
        <div>Trạng thái</div>
        <div>Hành động</div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-100px)]">
        {currentRows.map((row, index) => (
          <div
            key={index}
            className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] items-center max-sm:grid-cols-[1fr] max-sm:gap-2"
          >
            <div>{row.name}</div>
            <div>{row.date}</div>
            <div>{row.price.toLocaleString()}₫</div>
            <div>{row.review}</div>
            <div>{row.status}</div>
            <div className="flex items-center ">
              {isCancelable(row.rawDate) ? (
               <button 
               onClick={() => handleCancelRequest(row.id)}
               className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
               >
               Hủy
               </button>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-5 text-xs text-neutral-500">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Trước
        </button>

        <div className="text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Tiếp
        </button>
      </div>

      <ConfirmModal
        visible={showConfirm}
        title="Xác nhận hủy sân"
        message="Bạn có chắc chắn muốn hủy đặt sân này không?"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
        confirmText="Hủy sân"
      />
    </section>
  );
};

