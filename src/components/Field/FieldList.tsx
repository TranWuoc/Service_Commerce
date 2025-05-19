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
          <div className="text-center text-gray-500 py-4">Đang loading </div>
        )}
      </div>
    </section>
  );
}
