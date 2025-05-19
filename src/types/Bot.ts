export type Message = {
  sender: "user" | "bot";
  content: React.ReactNode;
  timestamp: string;
  images?: string[]; // Thêm thuộc tính images
};
