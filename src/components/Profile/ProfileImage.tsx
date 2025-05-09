"use client";

import * as React from "react";

interface ProfileImageProps {
  imageUrl: string;
  onImageChange?: () => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  onImageChange,
}) => {
  return (
    <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full">
      <img src={imageUrl} alt="Profile" className="size-full object-cover" />
      <button
        onClick={onImageChange}
        className="absolute inset-x-0 bottom-0 cursor-pointer bg-black bg-opacity-50 p-2 text-center text-xs text-white"
      >
        Change Photo
      </button>
    </div>
  );
};
