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
      
    </div>
  );
};
