import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";
import LandingPage from "../views/Landingpage";
interface AppRouterProps {
  children: React.ReactNode;
}

export const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        
      </Routes>
  );
};
