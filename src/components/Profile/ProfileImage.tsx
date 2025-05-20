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
    <div className="px-2  relative h-[100px] w-[100px] overflow-hidden rounded-full">
      <img src={imageUrl} alt="Profile" className="size-full object-cover" />
      
    </div>
  );
};
