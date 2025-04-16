"use client";
import * as React from "react";
import { useState } from "react";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
import { useLocation } from "react-router-dom";
interface TimeSlot {
  value: string;
  label: string;
  startHour: number;
  endHour: number;
}

interface BookingData {
  accountId: string;
  bookerName: string;
  fieldId: string;
  startDateTime: Date;
  endDateTime: Date;
}

export const BookingForm = () => {
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
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    fieldId: location.state?.fieldName || "", // Lấy tên sân từ state nếu có
    date: "",
    timeSlot: "",
  });


  // Assuming these would come from props or context in a real application
  const accountId = "USER_123"; // This should come from authentication context

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 5);
    return minDate.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const minAllowedDate = new Date(getMinDate());

    if (selectedDate >= minAllowedDate) {
      setFormData({ ...formData, date: e.target.value });
    }
  };

  const createBookingData = (): BookingData | null => {
    if (!formData.date || !formData.timeSlot) return null;

    const selectedTimeSlot = timeSlots.find(
      (slot) => slot.value === formData.timeSlot,
    );
    if (!selectedTimeSlot) return null;

    const baseDate = new Date(formData.date);

    // Create start datetime
    const startDateTime = new Date(baseDate);
    startDateTime.setHours(selectedTimeSlot.startHour, 0, 0, 0);

    // Create end datetime
    const endDateTime = new Date(baseDate);
    endDateTime.setHours(selectedTimeSlot.endHour, 0, 0, 0);

    return {
      accountId,
      bookerName: formData.name,
      fieldId: formData.fieldId,
      startDateTime,
      endDateTime,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = createBookingData();
    if (!bookingData) {
      console.error("Invalid form data");
      return;
    }

    try {
      console.log("Booking data to be submitted:", {
        accountId: bookingData.accountId,
        bookerName: bookingData.bookerName,
        fieldId: bookingData.fieldId,
        startDateTime: bookingData.startDateTime.toISOString(),
        endDateTime: bookingData.endDateTime.toISOString(),
      });


    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      fieldId: "",
      date: "",
      timeSlot: "",
    });
  };

  return (
    <div className="bg-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 mx-auto bg-white rounded-lg max-w-[800px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] h-[70vh] flex flex-col mt-0"
      >
        <div>
          <h2 className="mb-3 text-3xl text-center">MẪU ĐẶT SÂN</h2>

          <div className="flex flex-col gap-2">
            <InputField
              label="Tên người đặt sân"
              type="text"
              placeholder="Điền tên người đặt ..."
              value={formData.name}
              required
              name="bookerName"
              style={{ marginBottom: "0.75rem" }}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <InputField
              label="Tên sân"
              type="text"
              placeholder="Điền tên sân ..."
              value={formData.fieldId}
              required
              name="fieldId"
              style={{ marginBottom: "1.5rem" }}
              onChange={(e) =>
                setFormData({ ...formData, fieldId: e.target.value })
              }
            />

            <div className="flex flex-col items-center w-full max-w-[600px] mx-auto">
              <div className="flex w-full gap-6">
                <div className="flex-1">
                  <InputField
                    label="Ngày đặt sân"
                    type="date"
                    placeholder=""
                    value={formData.date}
                    required
                    name="date"
                    style={{ margin: 0, maxWidth: "none" }}
                    onChange={(e) => handleDateChange(e)}
                    min={getMinDate()}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col w-full">
                    <label className="self-start mb-2 text-xl text-black max-sm:text-xl">
                      Giờ đặt
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) =>
                        setFormData({ ...formData, timeSlot: e.target.value })
                      }
                      className="px-8 py-0 w-full text-2xl bg-white rounded-xl border-solid border-[2.5px] border-neutral-300 h-[40px] text-black-900 max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="" disabled>
                        Chọn khung giờ
                      </option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-auto pt-4">
          <Button variant="tertiary" text="Đặt sân" onClick={handleSubmit} />
          <Button variant="tertiary" text="Huỷ" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};
