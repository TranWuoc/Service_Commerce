"use client";

import { FieldCard } from "../Field/FieldCard";

// Example of more dynamic mock data
const MOCK_FIELDS = [
  {
    name: "Field A-123",
    type: "Agricultural",
    location: "so 26 ngach 3 ngo 371 De la thanh, phuong o cho dua, dong da",
    price: 100,
    status: "Co the dat ",
    usage: 75,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " khu 2 hoang cuong thanh ba phu thu",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " khu 2 hoang cuong thanh ba phu thu",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " khu 2 hoang cuong thanh ba phu thu",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " ",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " khu 2 hoang cuong thanh ba phu thu",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },
  {
    name: "Field B-456",
    type: "Football",
    location: " khu 2 hoang cuong thanh ba phu thu",
    price: 100,
    status: "Available",
    usage: 60,
    imageUrl: "https://placehold.co/400x400/333/333",
  },

  // Add more fields as needed
];

export function FieldList() {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-medium leading-7">
        Available Fields Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
  {MOCK_FIELDS.map((field, index) => (
    <FieldCard
      key={index}
      name={field.name}
      type={field.type}
      price={field.price}
      location={field.location}
      status={field.status}
      usage={field.usage}
      imageUrl={field.imageUrl}
    />
  ))}
</div>
    </section>
  );
}
