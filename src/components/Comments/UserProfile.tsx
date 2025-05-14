import * as React from "react";

interface UserProfileProps {
  imageUrl: string;
  name: string;
  role: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  imageUrl,
  name,
  role,
}) => {
  return (
    <article className="flex gap-4 items-center self-stretch pr-2 my-auto">
      <img
        src={imageUrl}
        alt={`${name}'s profile picture`}
        className="object-contain shrink-0 self-stretch my-auto rounded-full aspect-square w-[45px]"
      />
      <div className="flex gap-4 items-center self-stretch my-auto w-[110px]">
        <div className="self-stretch my-auto w-[110px]">
          <h3 className="text-base font-semibold tracking-wide">{name}</h3>
          <p className="text-xs tracking-wide">{role}</p>
        </div>
      </div>
    </article>
  );
};
