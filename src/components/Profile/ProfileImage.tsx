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
<div className="relative w-24 h-24 overflow-hidden rounded-full border border-gray-200">
  <img
    src={imageUrl}
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>

  );
};
