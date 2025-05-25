import * as React from "react";
import { TableRow } from "../Shared_components/TableRow";

interface FieldsTableProps {
  rows: any[];
  onCancel: (id: string) => void;
}

export const FieldsTable: React.FC<FieldsTableProps> = ({ rows, onCancel }) => {
  return (
    <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100 w-full">
      <div className="grid py-4 text-sm border-b border-dashed border-slate-200 grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_2fr] items-center text-slate-400 font-semibold">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Khung giờ</div>
        <div>Tổng giá</div>
        <div>Đặt cọc</div>
        <div>Trạng thái</div>
        <div className="text-center">Hành động</div>
      </div>

      {rows.length > 0 ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            name={row.name}
            date={row.date}
            timeRange={row.timeRange}
            price={row.price}
            depositPrice={row.deposit_price}
            displayStatus={row.displayStatus}
            receiptUrl={row.receiptUrl}
            bookingStatus={row.booking_status}
            onCancel={() => onCancel(row.id)}
          />
        ))
      ) : (
        <div className="text-center text-gray-400 py-10">Đang tải dữ liệu</div>
      )}
    </section>
  );
};
