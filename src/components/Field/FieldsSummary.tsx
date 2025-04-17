import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../Shared_components/InputField";
import { DropdownMenu } from "../Shared_components/DropdownMenu";
import Button from "../Shared_components/Button";
import { FieldList } from "../Field/FieldList";

export function FieldsSummary({
  onStartLoading,
  onStopLoading,
}: {
  onStartLoading: () => void;
  onStopLoading: () => void;
}) {
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái kiểm soát việc gọi onStartLoading
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error("⚠️ Trình duyệt không hỗ trợ Geolocation.");
      onStopLoading();
      return;
    }
    if (!isLoading) {
      onStartLoading(); // Chỉ gọi onStartLoading một lần
      setIsLoading(true); // Đánh dấu là đang tải
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Tọa độ:", latitude, longitude);
        setCurrentPosition({ latitude, longitude });
        onStopLoading();
      },
      (error) => {
        console.error("❌ Lỗi lấy vị trí:", error);
        onStopLoading();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="w-full">
      <FieldList />
    </div>
  );
}