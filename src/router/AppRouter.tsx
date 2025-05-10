import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../views/AuthLayout";
import Login from "../views/Login";
import Register from "../views/Register";
import LandingPage from "../views/Landingpage";
import { DashboardLayout } from "../views/DashboardLayout";
import { FieldsSummary } from "../components/Field/FieldsSummary";
import FieldDetails from "../views/FieldDetails";
import BookHistory from "../views/BookHistory";
import { Booking } from "../views/Booking";
import ProfileInput from "../components/Profile/ProfileInput";
import PaymentSuccessPage from "../views/paymentsuccess";
import { GoogleCallback } from "../components/Auth/GoogleCallBack";
import AdminLayout from "../views/AdminLayout";
import AdminDashboard from "../views/AdminDashboard";
import Statistics from "../views/AdminStatistic";
import FieldList from "../views/AdminFiledList";
import ManageFields from "../views/AdminManagerFileds";
import { useUser } from "../hooks/useUser";
import {Form} from "../views/FieldForm";
export const AppRouter: React.FC = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Kiểm tra vai trò người dùng

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/landingpage" element={<LandingPage />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout><FieldsSummary /></DashboardLayout>} />
      <Route path="/dashboard/Booking" element={<DashboardLayout><Booking /></DashboardLayout>} />
      <Route path="/dashboard/history" element={<DashboardLayout><BookHistory /></DashboardLayout>} />
      <Route path="/dashboard/Profile" element={<DashboardLayout><ProfileInput /></DashboardLayout>} />
      <Route path="/dashboard/vnpay-return" element={<DashboardLayout><PaymentSuccessPage /></DashboardLayout>} />

      {/* Google Callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/manage" element={<AdminLayout><ManageFields /></AdminLayout>} />
          <Route path="/admin/fileds" element={<AdminLayout><FieldList /></AdminLayout>} />
          <Route path="/admin/statistic" element={<AdminLayout><Statistics /></AdminLayout>} />
          <Route path="/admin/manage/addField" element={<AdminLayout><Form /></AdminLayout>} />
          <Route path="/admin/manage/FieldInfo" element={<AdminLayout><FieldDetails /></AdminLayout>} />
        </>
      )}

      {/* Non-admin Routes - Redirect to Dashboard if not Admin */}
      {!isAdmin && (
        <>
          <Route path="/dashboard/FieldInfo" element={<DashboardLayout><FieldDetails /></DashboardLayout>} />
          <Route path="/dashboard/Profile" element={<DashboardLayout><ProfileInput /></DashboardLayout>} />
          {/* Redirect non-admin users to Dashboard if trying to access admin routes */}
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}

      {/* Redirect to Landing Page if route is not found */}
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
    </Routes>
  );
};
