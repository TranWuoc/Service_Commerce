"use client";

import { useLocation } from "react-router-dom";

import FieldInfo from "../components/Field/FieldInfo";
import FieldPictureGallery from "../components/Field/FieldPictureGallery";

function FieldDetails() {
  const location = useLocation();
  const fieldInfo = location.state;
  const fieldImages = [
    "https://randomwordgenerator.com/img/picture-generator/52e0d744435ba914f1dc8460962e33791c3ad6e04e507749712e79d29244c3_640.jpg",
    "https://randomwordgenerator.com/img/picture-generator/52e0d744435ba914f1dc8460962e33791c3ad6e04e507749712e79d29244c3_640.jpg",
    "/docs/images/carousel/carousel-3.svg",
    "/docs/images/carousel/carousel-4.svg",
    "/docs/images/carousel/carousel-5.svg",
  ];
  if (!fieldInfo) {
    return <div>No field information available.</div>;
  }

  return (
    <div className="overflow-hidden bg-neutral-100 py-6 px-4">
      <div className="flex flex-col w-full max-w-[1000px] mx-auto">
        <div className="flex w-full gap-8 max-md:flex-col max-md:gap-4 items-center"> {/* Align items vertically */}
          <div className="flex-shrink-0 w-[30%] max-md:w-full max-md:mb-4 style={{ minHeight: '1400px' }}">
            <FieldInfo fieldInfo={fieldInfo} />
          </div>
          <div className="flex-grow w-[100%] max-md:w-full h-[80vh]">
  <FieldPictureGallery images={fieldImages} />
</div>
        </div>
      </div>
    </div>
  );
}

export default FieldDetails;