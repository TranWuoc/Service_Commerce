import React, { act, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { format, addDays, startOfWeek } from "date-fns";
import { fetchWeeklyBookings } from "../../actions/bookingActions";
import { TimeSlot } from "../../types/Booking";

const timeSlots: TimeSlot[] = [
  { value: "6-8", label: "06:00 - 08:00", startHour: 6, endHour: 8 },
  { value: "8-10", label: "08:00 - 10:00", startHour: 8, endHour: 10 },
  { value: "10-12", label: "10:00 - 12:00", startHour: 10, endHour: 12 },
  { value: "12-14", label: "12:00 - 14:00", startHour: 12, endHour: 14 },
  { value: "14-16", label: "14:00 - 16:00", startHour: 14, endHour: 16 },
  { value: "16-18", label: "16:00 - 18:00", startHour: 16, endHour: 18 },
  { value: "18-20", label: "18:00 - 20:00", startHour: 18, endHour: 20 },
  { value: "20-22", label: "20:00 - 22:00", startHour: 20, endHour: 22 },

];

interface SlotInfo {
  price: number;
  status: string;
  booked: boolean;
}

interface Props {
  startDate: string;
  fieldId: string;
  onSelect: (slot: { date: string; slot: string; price: number }) => void;
}

export default function FieldTable({ startDate, fieldId, onSelect }: Props) {
  const [selected, setSelected] = useState<{ date: string; slot: string } | null>(null);
  const [bookedSlots, setBookedSlots] = useState<{
    [date: string]: { [slot: string]: SlotInfo };
  }>({});

  let clickTimeout: ReturnType<typeof setTimeout> | null = null;

  const weekdays = useMemo(() => {
    if (!startDate) return [];

    const base = new Date(startDate);
    const weekStart = startOfWeek(base, { weekStartsOn: 1 });

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: `${i === 6 ? "CN" : `T${i + 2}`} - ${format(date, "dd/MM")}`,
        date: format(date, "yyyy-MM-dd"),
      };
    });
  }, [startDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !fieldId) return;

      try {
        const data = await fetchWeeklyBookings(startDate, fieldId);
        const map: {
          [date: string]: { [slot: string]: SlotInfo };
        } = {};

        for (const date in data.days) {
          data.days[date].forEach((slot) => {
            const startHour = parseInt(slot.start_time.split(":")[0]);
            const endHour = parseInt(slot.end_time.split(":")[0]);
            const value = `${startHour}-${endHour}`;
            if (!map[date]) map[date] = {};
            map[date][value] = {
              price: slot.price,
              status: slot.status,
              booked: slot.booked,
            };
          });
        }

        setBookedSlots(map);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchData();
  }, [startDate, fieldId]);

  const isSelected = (date: string, slot: string) =>
    selected?.date === date && selected.slot === slot;

  const isPastSlot = (date: string, startHour: number) => {
    const now = new Date();
    const slotTime = new Date(`${date}T00:00:00`);
    slotTime.setHours(startHour, 0, 0, 0);
    return slotTime < now;
  };

  const getSlotData = (date: string, slot: string): SlotInfo | null =>
    bookedSlots[date]?.[slot] || null;

  const handleCellClick = (date: string, slot: string, startHour: number) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return; 
    }

    clickTimeout = setTimeout(() => {
      clickTimeout = null;
      const slotData = getSlotData(date, slot);
      if (isPastSlot(date, startHour) || slotData?.booked) return;
      if (isSelected(date, slot)) return;

      const newSelection = { date, slot, price: slotData?.price || 0 };
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
                const slotData = getSlotData(day.date, value);
                const isPast = isPastSlot(day.date, startHour);
                const selectedNow = isSelected(day.date, value);
                const booked = slotData?.booked;
                const status = slotData?.status;
                const price = slotData?.price;

                let bgColor = "";
                if (isPast) {
                  bgColor = "bg-gray-300 text-gray-500 cursor-not-allowed";
                } else if (booked || status !== "active") {
                  bgColor = "bg-red-400 text-white cursor-not-allowed";
                } 

                return (
                  <td
                    key={day.date}
                    className={classNames(
                      "border p-2 text-center cursor-pointer transition-colors text-sm",
                      bgColor,
                      {
                        "hover:bg-amber-100": !booked && !selectedNow && !isPast && status === "active",
                        "bg-green-400 text-black": selectedNow,
                        
                      }
                    )}
                    onClick={() => handleCellClick(day.date, value, startHour)}
                  >
                    {price ? `${price.toLocaleString()}₫` : "-"}
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
