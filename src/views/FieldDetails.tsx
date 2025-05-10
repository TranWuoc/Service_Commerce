"use client";

import React from "react";
import FieldInfo from "../components/Field/FieldInfo";
import FieldPictureGallery from "../components/Field/FieldPictureGallery";
import { useField } from "../hooks/useField"; // Sử dụng context

function FieldDetails() {
  const { selectedField } = useField(); // Lấy field từ context

  const fieldImages = selectedField?.images?.length
    ? selectedField.images.map(image => 'http://localhost:8000/' + image.image_url)
    : [
        "https://randomwordgenerator.com/img/picture-generator/52e0d744435ba914f1dc8460962e33791c3ad6e04e507749712e79d29244c3_640.jpg",
        "https://randomwordgenerator.com/img/picture-generator/52e0d744435ba914f1dc8460962e33791c3ad6e04e507749712e79d29244c3_640.jpg",
        "/docs/images/carousel/carousel-3.svg",
        "/docs/images/carousel/carousel-4.svg",
        "/docs/images/carousel/carousel-5.svg",
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