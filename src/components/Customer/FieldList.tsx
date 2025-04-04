"use client";
import * as React from "react";
import { FieldCard } from "./FieldCard";

const MOCK_FIELDS = Array(5).fill({
  name: "Field A-123",
  type: "Agricultural",
  area: 25,
  status: "Active",
  usage: 75,
  imageUrl: "https://placehold.co/400x400/333/333",
});

export function FieldList() {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-medium leading-7">
        Available Fields Overview
      </h2>
      <div className="grid grid-cols-5 gap-4">
        {MOCK_FIELDS.map((field, index) => (
          <FieldCard key={index} {...field} />
        ))}
      </div>
    </section>
  );
}
