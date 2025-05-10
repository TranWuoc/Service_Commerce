"use client";

import React from "react";
import FieldInfo from "../components/Field/FieldInfo";
import FieldPictureGallery from "../components/Field/FieldPictureGallery";
import { useField } from "../hooks/useField"; // Sử dụng context

function FieldDetails() {
  const { selectedField } = useField(); // Lấy field từ context

  const fieldImages = selectedField?.images?.length
    ? selectedField.images.map((img) => ({
      id: img.id,
      image_url: `http://localhost:8000/${img.image_url}`,
    }))
    : [
          "https://images.unsplash.com/photo-1609788694280-5c66f9b2b805?auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1564518098550-cc3b6b8e8c62?auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1600369672747-059a59f5f63e?auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1625245002381-25046a74b15b?auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1583267743261-04b9f1a98ff5?auto=format&fit=crop&w=1170&q=80"
      ];
      
  if (!selectedField) {
    return <div className="text-center py-10 text-red-600 font-semibold">Không có thông tin sân được chọn.</div>;
  }

  return (
    <div className="overflow-hidden bg-neutral-100 py-6 px-4">
      <div className="flex flex-col w-full max-w-[1000px] mx-auto">
        <div className="flex w-full gap-8 max-md:flex-col max-md:gap-4 items-center">
          <div className="flex-shrink-0 w-[30%] max-md:w-full max-md:mb-4">
            <FieldInfo />
          </div>
          <div className="flex-grow w-full h-[80vh]">
            <FieldPictureGallery images={fieldImages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldDetails;