// App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter"; // Đảm bảo bạn import đúng AppRouter
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";
import { UserProvider } from "./Provider/UserProvider"; // Đảm bảo bạn import đúng UserProvider
import { FieldProvider } from "./Provider/FieldProvider";

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen ">
      <ToastProvider>
    <FieldProvider> {/* Bao bọc AppRouter trong FieldProvider */}
        <UserProvider> {/* Bao bọc AppRouter trong UserProvider */}
          <BrowserRouter>
            <Toaster />
            <AppRouter /> {/* Đây là nơi bạn định nghĩa các route */}
          </BrowserRouter>
        </UserProvider>
    </FieldProvider> {/* Đóng FieldProvider ở đây */}
      </ToastProvider>

    </div>
  );
};

export default App;
