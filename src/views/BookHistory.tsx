import React from "react";
import { FieldsTable } from "../components/Field/FieldTable";
// Giả sử SearchBar nằm trong cùng thư mục hoặc một thư mục khác
import { SearchBar } from "../components/Shared_components/SearchBar";

const BookHistory: React.FC = () => {
  return (
    <div className="p-5">
      {/* SearchBar Component */}
      <SearchBar />

      {/* FieldsTable Component */}
      <FieldsTable />
    </div>
  );
};

export default BookHistory;