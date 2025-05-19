"use client";
import FieldForm from "../components/Admin/AdminComponent/createField";

export const Form = () => {
  return (
    <main className="flex bg-neutral-100 min-h-screen">
      <div className="flex-1 ">
        <FieldForm
          onSubmit={(data) => {
            console.log("Thêm sân mới:", data);
            // Gửi dữ liệu đến API
          }}
        />{" "}
      </div>
    </main>
  );
};
