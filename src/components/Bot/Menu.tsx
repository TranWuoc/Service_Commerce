import React,{ RefObject } from "react";

type Props = {
 menuRef: RefObject<HTMLUListElement | null>;
 handleQuickOption: (option: string) => void;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
const Menu: React.FC<Props> = ({ menuRef,handleQuickOption,setShowMenu }) => {
  return (
    <ul  ref={menuRef}  className="absolute top-full right-0 mt-2 w-48 bg-white text-black shadow-lg rounded z-50 font-normal">
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"  onClick={() => {
                  handleQuickOption("đặt sân");
                  setShowMenu(false); 
                  
                }}>Đặt sân nhanh</li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"  onClick={() => {
                  handleQuickOption("Lịch sử");
                  setShowMenu(false); 
                  
                }}>Xem lịch sử đặt sân</li>
    </ul>
  );
};

export default Menu;
