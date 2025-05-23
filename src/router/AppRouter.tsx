import React, { useEffect, useState } from "react";
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
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminStatistics from "../components/Admin/AdminStatistic";
import AdminManageFields from "../components/Admin/AdminManageFields";
import FieldList from "../views/AdminFiledList";
import { Form } from "../views/FieldForm";
import { ProtectedRoute } from "./ProtectedRouter";
import UpdateField from "../components/Admin/AdminComponent/updateField";
import AdminManageUser from "../components/Admin/AdminManageUser";
import RevenueField from "../components/Admin/RevenueField";
import TopUsers from "../components/Admin/TopUsers";
import TimeTableField from "../components/Admin/AdminManageTimeTableField";
import Chat from "../components/Admin/Chat";
import { useAuth } from "../hooks/useAuth";
import RevenueFieldById from "../components/Admin/RevenueFieldById";
import AdminManageBooking from "../components/Admin/AdminManageBooking";
export const AppRouter: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    const storedIsAdmin = localStorage.getItem("isAdmin");

    setIsAdmin(storedIsAdmin === "true");
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Hoặc có thể trả về loading spinner
  }
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <AuthLayout>
              <Login />
            </AuthLayout>
          ) : isAdmin ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      <Route path="/landingpage" element={<LandingPage />} />
      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <FieldsSummary />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/Booking"
        element={
          <DashboardLayout>
            <Booking />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/history"
        element={
          <DashboardLayout>
            <BookHistory />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/Profile"
        element={
          <DashboardLayout>
            <ProfileInput />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/vnpay-return"
        element={
          <DashboardLayout>
            <PaymentSuccessPage />
          </DashboardLayout>
        }
      />

      {/* Google Callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Admin Routes dùng ProtectedRoute */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminManageFields />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manageBooking"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminManageBooking />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manageUser"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminManageUser />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistic"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/statistic/revenue"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <RevenueField />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/statistic/revenue/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <RevenueFieldById />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistic/top-user"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <TopUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage/addField"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Form />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage/FieldInfo/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <FieldDetails />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage/FieldInfo/timetable/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <TimeTableField />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/FieldInfo/:id"
        element={
          <DashboardLayout>
            <FieldDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={isAdmin ? "/admin/Profile" : "/dashboard/Profile"}
        element={
          isAdmin ? (
            <AdminLayout>
              <ProfileInput />
            </AdminLayout>
          ) : (
            <DashboardLayout>
              <ProfileInput />
            </DashboardLayout>
          )
        }
      />
      <Route
        path="/admin/manage/updateField/:fieldId"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <UpdateField />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/chat"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Chat />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* Redirect fallback */}
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
    </Routes>
  );
};

export default AppRouter;
