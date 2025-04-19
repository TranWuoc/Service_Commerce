"use client";

import { useEffect, useState } from "react";
import { MainHeaderCard } from "./MainHeaderCard";
import axios from "axios";
import { Field } from "../../types/Field";

export function FieldList() {
  const [fields, setFields] = useState<Field[]>([]); 
  
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/fields?per_page=12&page=1")
      .then((response) => {
        const fieldList: Field[] = response.data.data; // Đảm bảo response là mảng kiểu Field
        const filteredList = fieldList.filter(
          (field) => field.state?.id === "state-001"
        );

        const dataWithUsage = filteredList.map((field) => ({
          ...field,
          usage: Math.floor(Math.random() * 100),
        }));

        setFields(dataWithUsage); // Cập nhật state
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
       
      });
  }, []); 

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {fields.map((field) => (
          <MainHeaderCard key={field.id} field={field} /> // Truyền thông tin sân vào MainHeaderCard
        ))}
      </div>
    </section>
  );
}
