import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FieldList } from "../Field/FieldList";

export function ManagerFieldsAdmin() {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-medium leading-7">
        Available Fields Overview
      </h2>
      <FieldList />
    </div>
  );
}
