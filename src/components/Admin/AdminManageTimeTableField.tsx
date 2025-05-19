import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface TimeSlot {
  id: string;
  status: "active" | "inactive";
  priceMultiplier: number;
  note: string;
}

interface DaySchedule {
  day: string;
  timeSlots: TimeSlot[];
}

const TimeTableField: React.FC = () => {
  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const timeSlots = [
    "6:00 - 8:00",
    "08:00 - 10:00",
    "10:00 - 12:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
    "22:00 - 24:00",
  ];

  // Khởi tạo dữ liệu bảng
  const initialSchedule: DaySchedule[] = daysOfWeek.map((day) => ({
    day,
    timeSlots: timeSlots.map((_, index) => ({
      id: `${day}-${index}`,
      status: "active",
      priceMultiplier: 1,
      note: "",
    })),
  }));

  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    dayIndex: number;
    slotIndex: number;
  } | null>(null);

  const handleCellClick = (dayIndex: number, slotIndex: number) => {
    setCurrentEdit({ dayIndex, slotIndex });
    setSelectedSlot({ ...schedule[dayIndex].timeSlots[slotIndex] });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (currentEdit && selectedSlot) {
      const updatedSchedule = [...schedule];
      updatedSchedule[currentEdit.dayIndex].timeSlots[currentEdit.slotIndex] =
        selectedSlot;
      setSchedule(updatedSchedule);
      setIsOpen(false);
    }
  };

  const getCellColor = (status: "active" | "inactive", multiplier: number) => {
    if (status === "inactive") return "bg-gray-200";

    switch (multiplier) {
      case 1:
        return "bg-green-200";
      case 1.5:
        return "bg-yellow-200";
      case 2:
        return "bg-orange-200";
      case 2.5:
        return "bg-red-200";
      default:
        return "bg-green-200";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thời gian biểu sân hoạt động 
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100">Ngày/Giờ</th>
              {timeSlots.map((time) => (
                <th
                  key={time}
                  className="border border-gray-300 p-2 bg-gray-100"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, dayIndex) => (
              <tr key={day}>
                <td className="border border-gray-300 p-2 bg-gray-50">{day}</td>
                {timeSlots.map((_, slotIndex) => {
                  const slot = schedule[dayIndex].timeSlots[slotIndex];
                  return (
                    <td
                      key={`${dayIndex}-${slotIndex}`}
                      className={`border border-gray-300 p-2 cursor-pointer hover:opacity-80 ${getCellColor(slot.status, slot.priceMultiplier)}`}
                      onClick={() => handleCellClick(dayIndex, slotIndex)}
                    >
                      {slot.status === "active"
                        ? `x${slot.priceMultiplier}`
                        : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup chỉnh sửa */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-xl font-bold mb-4">
              Chỉnh sửa khung giờ
            </Dialog.Title>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Trạng thái:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedSlot?.status === "active"}
                    onChange={() =>
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, status: "active" } : null,
                      )
                    }
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedSlot?.status === "inactive"}
                    onChange={() =>
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, status: "inactive" } : null,
                      )
                    }
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
            </div>

            {selectedSlot?.status === "active" && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Hệ số giá:</label>
                <select
                  value={selectedSlot?.priceMultiplier}
                  onChange={(e) =>
                    setSelectedSlot((prev) =>
                      prev
                        ? { ...prev, priceMultiplier: Number(e.target.value) }
                        : null,
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="1">x1 (Giá gốc)</option>
                  <option value="1.5">x1.5</option>
                  <option value="2">x2</option>
                  <option value="2.5">x2.5</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Ghi chú:</label>
              <textarea
                value={selectedSlot?.note || ""}
                onChange={(e) =>
                  setSelectedSlot((prev) =>
                    prev ? { ...prev, note: e.target.value } : null,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TimeTableField;
