import React, { useState, useMemo } from "react";
import classNames from "classnames";
import { format, addDays, startOfWeek } from "date-fns";

const timeSlots = [
  { value: "6-8", label: "06:00 - 08:00" },
  { value: "8-10", label: "08:00 - 10:00" },
  { value: "10-12", label: "10:00 - 12:00" },
  { value: "14-16", label: "14:00 - 16:00" },
  { value: "16-18", label: "16:00 - 18:00" },
  { value: "18-20", label: "18:00 - 20:00" },
  { value: "20-22", label: "20:00 - 22:00" },
  { value: "22-24", label: "22:00 - 24:00" },
];

export default function FieldTable({
  startDate,
  onSelect,
}: {
  startDate: string;
  onSelect: (slot: string) => void;
}) {
  const [selected, setSelected] = useState<{ date: string; slot: string } | null>(null);

  // Tính tuần bắt đầu từ thứ Hai chứa startDate
  const weekdays = useMemo(() => {
    if (!startDate) return [];

    const base = new Date(startDate);
    const weekStart = startOfWeek(base, { weekStartsOn: 1 }); // Thứ Hai

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: `T${i + 2} - ${format(date, "dd/MM")}`,
        date: format(date, "yyyy-MM-dd"),
      };
    });
  }, [startDate]);

  const isBooked = (date: string, slot: string) => false; 

  const isSelected = (date: string, slot: string) =>
    selected?.date === date && selected.slot === slot;

  const toggleSelect = (date: string, slot: string) => {
    if (isBooked(date, slot)) return;

    if (isSelected(date, slot)) {
      setSelected(null);
      onSelect("");
    } else {
      const newSelection = { date, slot };
      setSelected(newSelection);
      onSelect(`${date}-${slot}`);
    }
  };

  if (!startDate) return null;

  return (
    <div className="overflow-auto p-4 w-full">
      <table className="table-fixed border-collapse w-full">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200 text-left w-[140px]">Khung giờ</th>
            {weekdays.map((day) => (
              <th key={day.date} className="border bg-gray-200 p-2 text-center">
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(({ value, label }) => (
            <tr key={value}>
              <td className="border p-2">{label}</td>
              {weekdays.map((day) => {
                const booked = isBooked(day.date, value);
                const selectedNow = isSelected(day.date, value);
                return (
                  <td
                    key={day.date}
                    className={classNames(
                      "border p-4 text-center cursor-pointer transition-colors",
                      {
                        "bg-red-400 text-white cursor-not-allowed": booked,
                        "bg-green-400 text-white": selectedNow,
                        "hover:bg-amber-100": !booked && !selectedNow,
                      }
                    )}
                    onClick={() => toggleSelect(day.date, value)}
                  >
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
