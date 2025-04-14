"use client";

import React from "react";
import { Comment } from "../../views/Comment";
import Button from "../Shared_components/Button";
import { CommentHeader } from "./CommentHeader";

interface CommentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fieldInfo: any; // Thay đổi kiểu dữ liệu phù hợp với fieldInfo
}

export const CommentOverlay: React.FC<CommentOverlayProps> = ({
  isOpen,
  onClose,
  fieldInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[60%] max-h-[90%] bg-white rounded-[20px] overflow-y-auto">
        <CommentHeader onClose={onClose} fieldInfo={fieldInfo} />
        <Comment />
      </div>
    </div>
  );
};