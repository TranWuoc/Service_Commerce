import { useState, ReactNode } from "react";
import { FieldContext } from "../Context/FieldContext";
import { Field } from "../types/Field";

interface FieldProviderProps {
  children: ReactNode;
}

export const FieldProvider = ({ children }: FieldProviderProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  return (
    <FieldContext.Provider value={{ fields, setFields, selectedField, setSelectedField }}>
      {children}
    </FieldContext.Provider>
  );
};
