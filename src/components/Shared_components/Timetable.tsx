import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { fetchWeeklyBookings } from "../../actions/bookingActions";
import { TimeSlot } from "../../types/Booking";

const timeSlots: TimeSlot[] = [
  { value: "6-8", label: "06:00 - 08:00", startHour: 6, endHour: 8 },
  { value: "8-10", label: "08:00 - 10:00", startHour: 8, endHour: 10 },
  { value: "10-12", label: "10:00 - 12:00", startHour: 10, endHour: 12 },
  { value: "14-16", label: "14:00 - 16:00", startHour: 14, endHour: 16 },
  { value: "16-18", label: "16:00 - 18:00", startHour: 16, endHour: 18 },
  { value: "18-20", label: "18:00 - 20:00", startHour: 18, endHour: 20 },
  { value: "20-22", label: "20:00 - 22:00", startHour: 20, endHour: 22 },
  { value: "22-24", label: "22:00 - 24:00", startHour: 22, endHour: 24 },
];

interface Props {
  startDate: string;
  fieldId: string;
  onSelect: (slot: { date: string; slot: string }) => void;
}

export default function FieldTable({ startDate, fieldId, onSelect }: Props) {
  const [selected, setSelected] = useState<{ date: string; slot: string } | null>(null);
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>({});
  let clickTimeout: ReturnType<typeof setTimeout> | null = null;

  const weekdays = useMemo(() => {
    if (!startDate) return [];

    const base = new Date(startDate);
    const weekStart = startOfWeek(base, { weekStartsOn: 1 });

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: `T${i + 2} - ${format(date, "dd/MM")}`,
        date: format(date, "yyyy-MM-dd"),
      };
    });
  }, [startDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !fieldId) return;

      try {
        const bookings = await fetchWeeklyBookings(startDate, fieldId);
        const bookedMap: { [key: string]: string[] } = {};

        for (const booking of bookings) {
          const start = parseISO(booking.date_start);
          const end = parseISO(booking.date_end);
          const date = format(start, "yyyy-MM-dd");

          const slots = timeSlots.filter(
            (slot) =>
              slot.startHour >= start.getHours() &&
              slot.endHour <= end.getHours()
          );

          slots.forEach((slot) => {
            if (!bookedMap[date]) bookedMap[date] = [];
            bookedMap[date].push(slot.value);
          });
        }

        setBookedSlots(bookedMap);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchData();
  }, [startDate, fieldId]);

  const isBooked = (date: string, slot: string) =>
    bookedSlots[date]?.includes(slot);

  const isSelected = (date: string, slot: string) =>
    selected?.date === date && selected.slot === slot;

  const isPastSlot = (date: string, startHour: number) => {
    const now = new Date();
    const slotTime = new Date(`${date}T00:00:00`);
    slotTime.setHours(startHour, 0, 0, 0);
    return slotTime < now;
  };

  const handleCellClick = (date: string, slot: string, startHour: number) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return; // double click → ignore
    }

    clickTimeout = setTimeout(() => {
      clickTimeout = null;
      if (isBooked(date, slot) || isPastSlot(date, startHour)) return;
      if (isSelected(date, slot)) return;

      const newSelection = { date, slot };
      setSelected(newSelection);
      onSelect(newSelection);
    }, 150); 
  };

  if (!startDate || !fieldId) return null;

  return (
    <div className="overflow-auto p-4 w-full max-w-full">
      <table className="table-fixed border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-5 bg-gray-200 text-left w-[140px]">Khung giờ</th>
            {weekdays.map((day) => (
              <th key={day.date} className="border bg-gray-200 p-2 text-center">
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(({ value, label, startHour }) => (
            <tr key={value}>
              <td className="border p-2">{label}</td>
              {weekdays.map((day) => {
                const booked = isBooked(day.date, value);
                const selectedNow = isSelected(day.date, value);
                const isPast = isPastSlot(day.date, startHour);

                return (
                  <td
                    key={day.date}
                    className={classNames(
                      "border p-4 text-center cursor-pointer transition-colors",
                      {
                        "bg-gray-300 text-gray-500 cursor-not-allowed": isPast, // Ưu tiên màu xám nếu đã qua
                        "bg-red-400 text-white cursor-not-allowed": booked && !isPast, // Màu đỏ chỉ khi booked và chưa qua
                        "bg-green-400 text-white": selectedNow,
                        "hover:bg-amber-100": !booked && !selectedNow && !isPast,
                      }
                    )}
                    onClick={() => handleCellClick(day.date, value, startHour)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
