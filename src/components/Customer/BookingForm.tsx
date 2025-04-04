"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import Button from "../Shared_components/Button";
export function BookingForm() {
  return (
    <form className="w-full bg-white p-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <InputField
            label="Pick Up Address"
            placeholder="Start Destination"
            icon="send"
            className="text-sm py-2 px-3"
          />
        </div>
        <div>
          <InputField
            label="Drop off Address"
            placeholder="End Destination"
            icon="search"
            className="text-sm py-2 px-3"
          />
        </div>
        <div>
          <InputField
            label="Passengers"
            placeholder="Total Passengers Count"
            icon="users"
            className="text-sm py-2 px-3"
          />
        </div>
        <div>
          <InputField
            label="User Current Location"
            placeholder="Where is the user now"
            icon="map-pin"
            className="text-sm py-2 px-3"
          />
        </div>

        <div className="flex items-end">
        <Button 
        type="tertiary"
        text="Book Now"
        onClick={() => {
          // Handle booking action here
          console.log("Booking button clicked");
        }}
        />
        </div>
      </div>
    </form>
  );
}
