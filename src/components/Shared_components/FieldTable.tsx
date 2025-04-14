import * as React from "react";
import { TableRow } from "./TableRow";

export const FieldsTable: React.FC = () => {
  return (
    <section className="p-5 bg-white rounded-2xl border border-solid border-slate-100">
      <div className="grid px-0 py-4 text-base font-semibold border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_1fr_1fr] text-slate-400 max-sm:gap-2 max-sm:grid-cols-[1fr]">
        <div>Tên sân</div>
        <div>Ngày đặt</div>
        <div>Tổng giá</div>
        <div>Đánh giá</div>
      </div>
      <div>
        <TableRow
          name="Tên sân 1"
          date="dd/mm/yy"
          price="1500.00"
          waitingStatus="Đang chờ"
        />
        <TableRow
          name="Tên sân 2"
          status="Đã thuê"
          date="dd/mm/yy"
          price="2500.00"
        />
        <TableRow
          name="Tên sân 3"
          status="Đã thuê"
          date="dd/mm/yy"
          price="450.00"
        />
        <TableRow
          name="Tên sân 4"
          status="Đã thuê"
          date="dd/mm/yy"
          price="552.00"
        />
        <TableRow
          name="Tên sân 5"
          status="Đã thuê"
          date="dd/mm/yy"
          price="1150.00"
        />
        <TableRow
          name="Tên sân 6"
          status="Đã thuê"
          date="dd/mm/yy"
          price="917.00"
        />
      </div>
      <div className="flex justify-between pt-5 text-xs text-neutral-500">
        <div>Items per page: 6</div>
        <div>1-4 of 10</div>
      </div>
    </section>
  );
};
