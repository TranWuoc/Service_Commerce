import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FieldsTable } from "../Field/FieldTable";
import { SearchBar } from "../Shared_components/SearchBar";
import { ConfirmModal } from "../Shared_components/ConfirmModal";

const BookHistoryForm: React.FC = () => {
  const [allRows, setAllRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/user");
      const bookings = res.data.data.map((booking: any) => {
        const isPaid = booking.receipt?.status === "paid";

        return {
          id: booking.id,
          name: booking.field.name,
          rawDate: booking.date_start,
          date: formatDate(booking.date_start),
          price: booking.field.price,
          status: isPaid ? "Đã thanh toán" : "Chưa thanh toán",
          receiptUrl: isPaid ? null : booking.receipt?.payment_url,
        
        };
      });
      setAllRows(bookings);
      setFilteredRows(bookings);
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

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    const result = allRows.filter((r) =>
      r.name.toLowerCase().includes(keyword)
    );
    setFilteredRows(result);
  };

  return (
    <div className="p-5 space-y-4">
      <SearchBar
        searchQuery={search}
        onInputChange={setSearch}
        onSearch={handleSearch}
      />

      <FieldsTable rows={filteredRows} onCancel={handleCancel} />

      <ConfirmModal
        visible={showConfirm}
        title="Xác nhận hủy sân"
        message="Bạn có chắc chắn muốn hủy đặt sân này không?"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        onConfirm={confirmCancel}
        confirmText="Hủy sân"
      />
    </div>
  );
};

export default BookHistoryForm;
