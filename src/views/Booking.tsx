"use client";
import { BookingForm } from "../components/BookingForm";

export const Booking = () => {
  return (
    <main className="flex bg-neutral-100 min-h-screen">
      <div className="flex-1 ">
        <BookingForm />
      </div>
    </main>
  );
};
