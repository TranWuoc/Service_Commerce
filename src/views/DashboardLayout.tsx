import React, { useState, useEffect } from "react";
import CustomerSidebar from "../components/Customer/CustomerSidebar";
import { AvatarMenu } from "../components/Profile/Avatar";
import { FieldHeader } from "../components/Field/FieldHeader";
import { FieldsSummary } from "../components/Field/FieldsSummary";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  useEffect(() => {
    setIsLoading(true);
    // Giả lập thời gian tải dữ liệu khi trang được load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Hiển thị Skeleton trong 3 giây

    return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount
  }, []);

  const handleStartLoading = () => {
    setIsLoading(true);
  };

  const handleStopLoading = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    // Skeleton Loader
    return (
      <div className="overflow-hidden bg-neutral-100">
        <div className="flex gap-5 max-md:flex-col">
          {/* Sidebar Skeleton */}
          <aside className="w-[16%] max-md:w-full">
            <div className="fixed left-0 top-0 h-screen w-60 z-30 bg-gray-200 animate-pulse"></div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="w-[84%] max-md:w-full">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-50 bg-neutral-100">
              <div className="flex items-center py-6 px-8 justify-between">
                {/* FieldHeader Skeleton */}
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                {/* Avatar Skeleton */}
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8 grid grid-cols-4 gap-6 max-md:grid-cols-1">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                  >
                    {/* Image Skeleton */}
                    <div className="w-full h-40 bg-gray-200 rounded"></div>
                    {/* Title Skeleton */}
                    <div className="mt-4 w-3/4 h-6 bg-gray-200 rounded"></div>
                    {/* Description Skeleton */}
                    <div className="mt-2 w-full h-4 bg-gray-200 rounded"></div>
                    <div className="mt-2 w-5/6 h-4 bg-gray-200 rounded"></div>
                    {/* Button Skeleton */}
                    <div className="mt-4 w-1/3 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
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
              <FieldHeader />

              <div className="ml-auto flex justify-end gap-4">
                <AvatarMenu />
              </div>
            </div>
          </div>

          {/* Hiển thị FieldsSummary */}
         

          {/* Main content */}
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="relative flex-1 mt-10">
              {React.isValidElement(children)
                  ? React.cloneElement(children, {
              onStartLoading: handleStartLoading,
              onStopLoading: handleStopLoading,
              location,
            })
          : children}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
};
