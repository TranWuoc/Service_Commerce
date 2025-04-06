"use client";

import { useLocation } from "react-router-dom";

import FieldInfo from "../components/Field/FieldInfo";
import FieldPictureGallery from "../components/Field/FieldPictureGallery";

function FieldDetails() {
  const location = useLocation();
  const fieldInfo = location.state;

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
          <div className="flex-grow w-[60%] max-md:w-full">
            <FieldPictureGallery />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldDetails;