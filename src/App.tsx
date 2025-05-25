// App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";
import { UserProvider } from "./Provider/UserProvider"; 
import { FieldProvider } from "./Provider/FieldProvider";
import { AuthProvider } from "./Context/AuthContext";

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen ">
      <BrowserRouter>
        <ToastProvider>
          <FieldProvider>
            <AuthProvider>
              <UserProvider>
                <Toaster />
                <AppRouter />
              </UserProvider>
            </AuthProvider>
          </FieldProvider>
        </ToastProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
