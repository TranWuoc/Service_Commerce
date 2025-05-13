import * as React from "react";
import { useState, useEffect } from "react";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
import { useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useToast } from "../../hooks/use-toast";
import axiosInstance from "../../api/axiosInstance";
import Autosuggest from "react-autosuggest";

interface Field {
  id: number;
  name: string;
}

interface TimeSlot {
  value: string;
  label: string;
  startHour: number;
  endHour: number;
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
  const { user } = useUser();
  const { toast } = useToast();

  const [fields, setFields] = useState<Field[]>([]);
  const [suggestions, setSuggestions] = useState<Field[]>([]);
  const [inputValue, setInputValue] = useState(location.state?.fieldName || "");
  const [formData, setFormData] = useState({
    name: location.state?.fieldName || "",
    fieldId: location.state?.fieldId || "",
    date: "",
    timeSlot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axiosInstance.get("/fields");
        setFields(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sân:", error);
      }
    };
    fetchFields();
  }, []);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate >= new Date(getMinDate())) {
      setFormData({ ...formData, date: e.target.value });
    }
    else {
      toast({
        title: "Lỗi",
        description: "Ngày đặt sân phải từ 5 ngày sau ngày hiện tại.",
        variant: "destructive",
      });
    }
  };

  const getSuggestions = (value: string) => {
    const input = value.trim().toLowerCase();
    return fields.filter((field) => field.name.toLowerCase().includes(input));
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
     setSuggestions(getSuggestions(value).slice(0, 3));
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

  const createBookingData = () => {
    const slot = timeSlots.find((s) => s.value === formData.timeSlot);
    if (!slot || !formData.date || !formData.fieldId) return null;

    const base = new Date(formData.date);
    const start = new Date(base);
    const end = new Date(base);
    start.setHours(slot.startHour, 0, 0, 0);
    end.setHours(slot.endHour, 0, 0, 0);

    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

    return {
      field_id: formData.fieldId,
      date_start: fmt(start),
      date_end: fmt(end),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = createBookingData();
    if (!data) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin đặt sân.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/bookings", data);

      const payUrl = res.data.data?.receipt?.payment_url;

      console.log("payUrl", payUrl);
      toast({
        title: "Đặt sân thành công!",
        description: "Đang chuyển đến trang thanh toán...",
      });
      window.location.href = payUrl;
    } catch (error: any) {
      console.error("Error submitting booking:", error);
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
  };

  return (
    <div className="bg-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 mx-auto bg-white rounded-lg max-w-[800px] w-full shadow-[0px_5px_15px_rgba(0,0,0,0.12)] h-[70vh] flex flex-col"
      >
        <h2 className="mb-3 text-3xl text-center">MẪU ĐẶT SÂN</h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col w-full">
            <label className="mb-2 text-xl text-black">
              Tên sân <span className="text-red-500 ml-1">*</span>
            </label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={(s: Field) => s.name}
              renderSuggestion={(s: Field) => <div className="p-2">{s.name}</div>}
              onSuggestionSelected={onSuggestionSelected}
              inputProps={{
                placeholder: "Nhập tên sân...",
                value: inputValue,
                onChange: (_, { newValue }) => setInputValue(newValue),
                className:
                  "px-4 py-2 text-xl bg-white border border-gray-300 h-[40px] rounded-xl focus:outline-none focus:border-amber-500 w-full",
              }}
            />
          </div>

          <div className="flex flex-col items-center w-full mx-auto">
            {/* Bảng ngày và giờ */}
            <div className="flex w-full gap-6">
              <div className="flex-1">
                <InputField
                  label="Ngày đặt sân"
                  type="date"
                  value={formData.date}
                  required
                  name="date"
                  style={{ margin: 0, maxWidth: "none" }}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  onKeyDown={(e) => e.preventDefault()}
                  className="px-8 py-0 w-full text-2xl bg-white rounded-xl h-[35px] border-[2.5px] border-neutral-300  border-[2.5px] focus:outline-none focus:border-amber-500 cursor-pointer"
                ></InputField>
              </div>

              <div className="flex-1">
                <label className="self-start mb-2 text-xl text-black">
                  Giờ đặt <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSlot: e.target.value })
                  }
                  className="px-8 py-0 w-full text-2xl bg-white rounded-xl h-[43px] border-[2.5px] border-neutral-300  border-[2.5px] focus:outline-none focus:border-amber-500 cursor-pointer mt-1"
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

        <div className="flex gap-4 justify-center mt-auto pt-4">
          <Button
            variant="tertiary"
            text={isSubmitting ? "Đang đặt sân..." : "Đặt sân"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
          <Button
            variant="tertiary"
            text="Huỷ"
            onClick={handleCancel}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
