"use client";

import { useEffect, useState } from "react";
import { MainHeaderCard } from "./MainHeaderCard";
import axios from "axios";

export function FieldList() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/fields?per_page=12&page=1")
      .then((response) => {
        const fieldList = response.data.data;
        const filteredList = fieldList.filter((field: any) => field.state?.id === "state-001");

        const dataWithUsage = filteredList.map((field: any) => ({
          ...field,
          usage: Math.floor(Math.random() * 100),
        }));

        setFields(dataWithUsage);
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
      });
  }, []);

  return (
    <section className="mt-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {fields.map((field: any) => (
          <MainHeaderCard key={field.id} field={field} />
        ))}
      </div>
    </section>
  );
}
