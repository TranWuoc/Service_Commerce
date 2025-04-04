import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </div>
  );
};

export default App;