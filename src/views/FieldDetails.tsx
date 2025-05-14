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
          {
            id: "1",
            image_url: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Sân cỏ tự nhiên rộng lớn
          },
          {
            id: "2",
            image_url: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Sân cỏ xanh mướt
          },
          {
            id: "3",
            image_url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Sân có vạch kẻ trắng rõ nét
          },
          {
            id: "4",
            image_url: "https://images.pexels.com/photos/863105/pexels-photo-863105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Sân với khung thành
          },
          {
            id: "5",
            image_url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Sân từ góc cao
          },
      ];

  if (!selectedField) {
    return <div className="text-center py-10 text-red-600 font-semibold">Không có thông tin sân được chọn.</div>;
  }

  return (
    <div className="overflow-hidden h-[80vh] bg-neutral-100 py-6 px-4">
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