import React,{ RefObject } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Menu from "./Menu"; // Import Menu component

type Props = {
  onClose: () => void;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: RefObject<HTMLUListElement | null>;
  handleQuickOption: (option: string) => void;
};

const Header: React.FC<Props> = ({ onClose, showMenu, setShowMenu, menuRef,handleQuickOption }) => {
  return (
    <div className="relative bg-yellow-500 text-white p-4 text-lg font-bold flex justify-between items-center">
      <span>Chat Bot</span>
      <div className="flex items-center gap-2">
        
        <button id="menu-toggle-button" onClick={() => setShowMenu((prev) => !prev)} className="text-white text-lg px-2 py-0.5 hover:text-gray-300">
          <FaBars />
        </button>
        {showMenu && <Menu menuRef={menuRef} handleQuickOption={handleQuickOption} setShowMenu={setShowMenu}/>}
        <button onClick={onClose} className="text-white text-lg px-2 py-0.5 hover:text-red-700">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Header;
