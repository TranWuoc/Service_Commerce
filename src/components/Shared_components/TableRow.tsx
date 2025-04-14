import * as React from "react";

interface TableRowProps {
  name: string;
  date: string;
  price: string;
  waitingStatus?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  name,
  date,
  price,

}) => {
  

  return (
    <div className="grid px-0 py-4 border-b border-solid border-b-slate-100 grid-cols-[2fr_1fr_1fr_1fr_1fr] max-sm:gap-2 max-sm:grid-cols-[1fr]">
      <div>
        <div className="text-sm font-semibold text-slate-800">{name}</div>
        <div className="text-xs text-slate-400">Mã sân</div>
      </div>
      <div>{date}</div>
      <div>{price}</div>
      
    </div>
  );
};
