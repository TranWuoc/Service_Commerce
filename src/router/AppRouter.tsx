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
import AdminLayout from "../views/AdminLayout";
import AdminDashboard from "../views/AdminDashboard";
import Statistics from "../views/AdminStatistic";
import FieldList from "../views/AdminFiledList";
import ManageFields from "../views/AdminManagerFileds";
import { useUser } from "../Context/UserContext";
import {Form} from "../views/FieldForm";
import UpdateField from "../components/Field/updateField";
export const AppRouter: React.FC = () => {
  const { user } = useUser(); // Lấy thông tin người dùng từ UserContext
  const isAdmin = user?.is_admin; // Kiểm tra vai trò người dùng

  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout><FieldsSummary /></DashboardLayout>} />
      <Route
        path={isAdmin ? "/admin/manage/FieldInfo" : "/dashboard/FieldInfo"} // Thay đổi path dựa trên vai trò
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
      />      <Route path="/dashboard/Booking" element={<DashboardLayout><Booking/></DashboardLayout>} />
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
      <Route path="/dashboard/history" element={<DashboardLayout><BookHistory /></DashboardLayout>} />
      {/* <Route path ="/dashboard/Profile" element ={<DashboardLayout><ProfileInput/></DashboardLayout>} /> */}
      <Route 
        path={isAdmin ? "admin/Profile" : "dashboard/Profile"} // Thay đổi path dựa trên vai trò
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
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/manage" element={<AdminLayout><ManageFields /></AdminLayout>} />
      <Route path="/admin/fileds" element={<AdminLayout><FieldList /></AdminLayout>} />
      <Route path="/admin/statistic" element={<AdminLayout><Statistics /></AdminLayout>} />
      <Route path="admin/manage/addField" element={<AdminLayout><Form /></AdminLayout>} />
      <Route 
        path="/admin/manage/updateField/:fieldId" // Route mới cho UpdateField
        element={
          <AdminLayout>
            <UpdateField />
          </AdminLayout>
        } 
      />
    </Routes>
  );
};
