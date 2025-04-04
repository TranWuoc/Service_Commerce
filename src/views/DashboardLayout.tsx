"use client";
import React from "react";
import CustomerSidebar from "../components/Customer/CustomerSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex min-h-screen bg-white">
        <aside className="fixed left-0 top-0 h-full w-60 z-30">
          <CustomerSidebar />
        </aside>
        <main className="pl-60 w-full">{children}</main>
      </div>
    </>
  );
};
