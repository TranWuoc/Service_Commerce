import * as React from "react";
import { ProfileImage } from "./ProfileImage";

interface ProfileHeaderProps {
  name: string;
  memberSince: string;
  imageUrl: string;
  onImageChange?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  memberSince,
  imageUrl,
  onImageChange,
}) => {
  return (
    <header className="mb-8 flex items-center gap-6">
      <ProfileImage imageUrl={imageUrl} onImageChange={onImageChange} />
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-slate-800">{name}</h1>
        <p className="text-sm text-slate-400">Member since {memberSince}</p>
      </div>
    </header>
  );
};
