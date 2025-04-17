import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";

import LandingPage from "../views/Landingpage";

import {DashboardLayout}from "../views/DashboardLayout";
import  {BookingForm}   from "../components/Customer/BookingForm";
import FieldInfo from "../views/FieldInfo";
import { TestPage } from "../views/test";


interface AppRouterProps {
  children: React.ReactNode;
}

export const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout><BookingForm /></DashboardLayout>} />
        <Route path="/FieldInfo" element={<DashboardLayout><FieldInfo/></DashboardLayout>}/>
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/test" element={<TestPage />}/>
        
      </Routes>
  );
};
