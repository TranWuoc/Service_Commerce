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
import AdminDashboard from "../views/AdminDashboard";
import Statistics from "../views/AdminStatistic";
import FieldList from "../views/AdminFiledList";
import ManageFields from "../views/AdminManagerFileds";
import { Form } from "../views/FieldForm";
import { ProtectedRoute } from "./ProtectedRouter"; // thêm dòng này
import UpdateField from "../components/Field/updateField";
export const AppRouter: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

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
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/landingpage" element={<LandingPage />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout><FieldsSummary /></DashboardLayout>} />
      <Route path="/dashboard/Booking" element={<DashboardLayout><Booking /></DashboardLayout>} />
      <Route path="/dashboard/history" element={<DashboardLayout><BookHistory /></DashboardLayout>} />
      <Route path="/dashboard/Profile" element={<DashboardLayout><ProfileInput /></DashboardLayout>} />
      <Route path="/dashboard/vnpay-return" element={<DashboardLayout><PaymentSuccessPage /></DashboardLayout>} />
      <Route path="/dashboard/FieldInfo" element={<DashboardLayout><FieldDetails /></DashboardLayout>} />

      {/* Google Callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Admin Routes dùng ProtectedRoute */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><ManageFields /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fileds"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><FieldList /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistic"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><Statistics /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage/addField"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><Form /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage/FieldInfo"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout><FieldDetails /></AdminLayout>
          </ProtectedRoute>
        }
      />

   
      <Route
        path={isAdmin ? "/admin/manage/FieldInfo" : "/dashboard/FieldInfo"}
        element={
          isAdmin ? (
            <AdminLayout>
              <FieldDetails />
            </AdminLayout>
          ) : (
            <DashboardLayout>
              <FieldDetails />
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


      {/* Redirect fallback */}
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
    </Routes>
  );
};
// export default AppRouter;