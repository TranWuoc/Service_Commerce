import * as React from "react";
import { UserProfile } from "./UserProfile";

interface CommentItemProps {
  imageUrl: string;
  name: string;
  role: string;
  comment: string;
  date: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  imageUrl,
  name,
  role,
  comment,
  date,
}) => {
  return (
    <article className="flex flex-col items-start w-full">
      <div className="flex gap-6 items-center h-[45px] rotate-[-0.0014542984538468934rad] text-neutral-950">
        <UserProfile imageUrl={imageUrl} name={name} role={role} />
        
      </div>
      <div className="flex flex-col items-start px-12 pt-4 pb-2 mt-1.5 ml-14 w-full font-semibold bg-zinc-300 max-w-[780px] rounded-[50px] max-md:px-5 max-md:max-w-full">
        <p className="text-base text-black">{comment}</p>
        <div className="flex gap-1 mt-3 text-xs text-stone-300">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9cec473df0839e3f3c4212b90778e9706f278e9?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
            alt="Calendar icon"
            className="object-contain shrink-0 aspect-[1.05] w-[21px]"
          />
          <time>{date}</time>
        </div>
      </div>
    </article>
  );
};
