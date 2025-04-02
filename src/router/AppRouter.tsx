import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";

interface AppRouterProps {
  children: React.ReactNode;
}

export const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
      </Routes>
  );
};
