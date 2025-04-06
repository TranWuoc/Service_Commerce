"use client";
import React from "react";
import CustomerSidebar from "../components/Customer/CustomerSidebar";
import Avatar from "../components/Shared_components/Avatar";
import { FieldHeader } from "../components/Field/FieldHeader";

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
      <div className="overflow-hidden bg-neutral-100">
        <div className="flex gap-5 max-md:flex-col">
          <aside className="w-[16%] max-md:w-full">
            <div className="fixed left-0 top-0 h-screen w-60 z-30 bg-white border-r border-zinc-100">
              <CustomerSidebar />
            </div>
          </aside>

          <main className="w-[84%] max-md:w-full">
            {/* Fixed section containing Avatar */}
            <div className="sticky top-0 z-50 bg-neutral-100">
              <div className="flex items-center py-6 px-8 justify-between">
                {/* FieldHeader - Align left */}
                <div className="flex-none">
                  <FieldHeader />
                </div>

                {/* Avatar - Align right */}
                <div className="ml-auto flex justify-end">
                  <Avatar />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-full max-md:max-w-full">
              <div className="relative flex-1">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

