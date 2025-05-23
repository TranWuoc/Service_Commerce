import * as React from "react";

interface TableRowProps {
  name: string;
  date_start: string;
  price: string | number;
  status: string;
  review?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  name,
  date_start,
  price,
  status,
  review,
}) => {
  return (
    <div className="grid py-4 text-sm border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] max-sm:gap-2 max-sm:grid-cols-[1fr]">
      <div>{name}</div>
      <div>{date_start}</div>
      <div>{Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</div>
     
      <div
        className={`font-medium ${
        status === "Đã thanh toán cọc "
      ? "text-blue-600"
      : status === "Chưa thanh toán cọc"
      ? "text-yellow-600"
      : "text-green-600"
        }`}
      >
        {status}
      </div>
      <div>
        { status !== "Đã thuê"  && (
          <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};
