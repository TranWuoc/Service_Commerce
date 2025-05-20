import React, { useState, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import { useLocation } from "react-router-dom";
import { fetchBookedTimeSlots } from "../../actions/bookingActions";
import Button from "../Shared_components/Button";
import { InputField } from "../Shared_components/InputField";
import FieldTable from "../Shared_components/Timetable";
import {
  fetchFields,
  createBooking,
  prepareBookingData,
  getMinBookingDate,
  validateBookingDate,
} from "../../actions/bookingActions";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useToast } from "../../hooks/use-toast";

import type { Field, TimeSlot, BookingFormData } from "../../types/Booking";

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
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [suggestions, setSuggestions] = useState<Field[]>([]);
  const [inputValue, setInputValue] = useState(location.state?.fieldName || "");
  const [formData, setFormData] = useState<BookingFormData>({
    name: location.state?.fieldName || "",
    fieldId: location.state?.fieldId || "",
   date: location.state?.date || "", 
    timeSlot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
    fetchFields()
      .then(setFields)
      .catch(() =>
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sân bóng",
          variant: "destructive",
        })
      );
  }, [toast]);
useEffect(() => {
  // Nếu location có truyền fieldId + fieldName từ trang trước
  if (location.state?.fieldId && location.state?.fieldName) {
    const fieldId = location.state.fieldId.toString();
    const fieldName = location.state.fieldName;
     const date = location.state.date || "";
    // Gán trực tiếp input và formData
    setInputValue(fieldName);
    setFormData((prev) => ({
      ...prev,
      name: fieldName,
      fieldId: fieldId,
      date: date
    }));
  }
}, [location.state]);


  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!validateBookingDate(value)) {
      toast({
        title: "Lỗi",
        description: "Ngày đặt sân phải từ ngày hiện tại trở đi.",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => {
    const updated = { ...prev, date: value };
   
    return updated;
  });
};
  // Autosuggest
  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const input = value.trim().toLowerCase();
    setSuggestions(
      fields.filter((f) => f.name.toLowerCase().includes(input)).slice(0, 3)
    );
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const onSuggestionSelected = (
    event: any,
    { suggestion }: { suggestion: Field }
  ) => {
    setFormData({
      ...formData,
      name: suggestion.name,
      fieldId: suggestion.id.toString(),
    });
    setInputValue(suggestion.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = prepareBookingData(
      formData.fieldId,
      formData.date,
      formData.timeSlot,
      timeSlots
    );

    if (!bookingData) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin đặt sân.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createBooking(bookingData);
      const payUrl = res.data?.receipt?.payment_url;

      toast({
        title: "Đặt sân thành công!",
        description: "Đang chuyển đến trang thanh toán...",
      });

      if (payUrl) window.location.href = payUrl;
    } catch (error: any) {
      toast({
        title: "Đặt sân thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", fieldId: "", date: "", timeSlot: "" });
    setInputValue("");
    navigate("/dashboard");
  };

  return (
    <div className="bg-neutral-100">
 <form
  onSubmit={handleSubmit}
  className={`mx-auto bg-white rounded-lg max-w-[700px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] flex flex-col transition-all duration-300 ${
    formData.fieldId && formData.date ? "max-h-[90vh] h-[90vh]" : "h-auto"
  }`}
>
  <h2 className="p-6 pb-2 text-3xl text-center">MẪU ĐẶT SÂN</h2>

  {/* Nội dung chính - cuộn được nếu timetable xuất hiện */}
  <div className="flex-grow overflow-auto px-6 space-y-4">
    {/* --- Tên sân --- */}
    <div className="flex flex-col w-full">
      <label className="mb-2 text-xl text-black">
        Tên sân <span className="text-red-500 ml-1">*</span>
      </label>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(s: Field) => s.name}
        renderSuggestion={(s: Field) => (
          <div className="p-2 bg-gray-300 text-white-500">{s.name}</div>
        )}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={{
          placeholder: "Nhập tên sân...",
          value: inputValue,
          onChange: (_, { newValue }) => {
            setInputValue(newValue);
            const matchedField = fields.find(
              (f) =>
                f.name.toLowerCase() === newValue.trim().toLowerCase()
            );
            if (!matchedField) {
              setFormData((prev) => ({
                ...prev,
                fieldId: "",
                name: newValue,
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                fieldId: matchedField.id.toString(),
                name: matchedField.name,
              }));
            }
          },
          className:
            "px-4 py-2 text-xl bg-white border border-gray-300 h-[40px] rounded-xl focus:outline-none focus:border-amber-500 w-full",
        }}
      />
    </div>

    {/* --- Ngày đặt sân --- */}
    <div className="flex flex-col w-full mt-2">
      <InputField
        label="Ngày đặt sân"
        type="date"
        value={formData.date}
        required
        name="date"
        onChange={handleDateChange}
        min={getMinBookingDate()}
        onKeyDown={(e) => e.preventDefault()}
        className="px-4 py-2 text-xl bg-white border border-gray-300 h-[40px] rounded-xl focus:outline-none focus:border-amber-500 w-full"
      />
    </div>

    {/* --- Timetable --- */}
    {formData.fieldId && formData.date && (
      <div className="mt-2">
        <FieldTable
          startDate={formData.date}
          fieldId={formData.fieldId}
          onSelect={({ date, slot }) => {
            setFormData((prev) => ({
              ...prev,
              date,
              timeSlot: slot,
            }));
          }}
        />
      </div>
    )}
  </div>

  {/* --- Buttons luôn ở dưới --- */}
  <div className="mt-auto px-6 pb-6 pt-4 flex gap-4 justify-center">
    <Button
      type="tertiary"
      text={isSubmitting ? "Đang đặt sân..." : "Xác nhận"}
      disabled={isSubmitting}
      onClick={handleSubmit}
    />
    <Button
      type="secondary"
      text="Huỷ"
      disabled={isSubmitting}
      onClick={handleCancel}
    />
  </div>
</form>
    </div>
  );
};
