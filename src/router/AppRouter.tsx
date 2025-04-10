import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";
import LandingPage from "../views/Landingpage";
import { DashboardLayout } from "../views/DashboardLayout";
import { FieldsSummary} from "../components/Field/FieldsSummary";
import FieldDetails from "../views/FieldDetails";
import {Booking} from "../views/Booking";
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout><FieldsSummary /></DashboardLayout>} />
      <Route path="/FieldInfo" element={<DashboardLayout><FieldDetails/></DashboardLayout>} />
      <Route path="/Dashboard/Booking" element={<DashboardLayout><Booking/></DashboardLayout>} />
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
      
    </Routes>
  );
};
