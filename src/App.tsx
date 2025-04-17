// App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter"; // Đảm bảo bạn import đúng AppRouter
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";
import { UserProvider } from "./Context/UserContext"; // Import UserProvider

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen ">
      <ToastProvider>
        <UserProvider> {/* Bao bọc AppRouter trong UserProvider */}
          <BrowserRouter>
            <Toaster />
            <AppRouter /> {/* Đây là nơi bạn định nghĩa các route */}
          </BrowserRouter>
        </UserProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
