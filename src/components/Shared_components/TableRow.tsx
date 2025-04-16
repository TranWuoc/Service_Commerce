import * as React from "react";

interface TableRowProps {
  name: string;
  date: string;
  price: string;
  status: string;
  review: string;
}

export const TableRow: React.FC<TableRowProps> = ({ name, date, price, status, review }) => {
  return (
    <div className="grid py-4 text-sm border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_3fr_1fr_1fr] max-sm:gap-2 max-sm:grid-cols-[1fr]">
      <div>{name}</div>
      <div>{date}</div>
      <div>{price}</div>
      <div className="truncate">{review}</div>
      <div>{status}</div>
      <div>
        {status === "Đang chờ" && (
          <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};