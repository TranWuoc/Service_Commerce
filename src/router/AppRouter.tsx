import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";
import LandingPage from "../views/Landingpage";
import { DashboardLayout } from "../views/DashboardLayout";
import { FieldsSummary} from "../components/Field/FieldsSummary";
import FieldDetails from "../views/FieldDetails";
import BookHistory from "../views/BookHistory";
import {Booking} from "../views/Booking";
import ProfileInput from "../components/Profile/ProfileInput";
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout><FieldsSummary /></DashboardLayout>} />
      <Route path="/dashboard/FieldInfo" element={<DashboardLayout><FieldDetails/></DashboardLayout>} />
      <Route path="/dashboard/Booking" element={<DashboardLayout><Booking/></DashboardLayout>} />
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
      <Route path="/dashboard/history" element={<DashboardLayout><BookHistory /></DashboardLayout>} />
      <Route path ="/dashboard/Profile" element ={<DashboardLayout><ProfileInput/></DashboardLayout>} />
    </Routes>
  );
};
