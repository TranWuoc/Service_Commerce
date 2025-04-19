import React from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import { Home } from "@mui/icons-material";
import ManagerFields from "../components/Admin/ManagerFiels";


const AdminManager: React.FC = () => {
    return (
        <div className="flex flex-col h-screen ">
            <AdminSidebar />
            <div className="flex bg-gray-100 ml-64 p-4">
                <img 
                    src="/ic_dashboard.svg"
                    alt="Logo"
                    className="w-16 h-16 mr-1"
                /> 
               <h1 className="flex items-center text-4xl font-bold text-gray-800">Quản lý thông tin sân</h1>
            </div>
            <div className="flex bg-gray-100 p-4">
                <ManagerFields />
            </div>
    
        </div>    
    );
};

export default AdminManager;
