import React from "react";
import { MainHeaderCard } from "./MainHeaderCard";

export function FieldList({ fields }: { fields: any[] }) {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {fields.length > 0 ? (
  fields.map((field) => (
    <MainHeaderCard key={field.id} field={field} />
  ))
) : (
  Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="animate-pulse bg-gray-200 h-[200px] rounded-lg"
    />
  ))
)}
      </div>
    </section>
  );
}
