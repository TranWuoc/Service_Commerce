import { createContext } from 'react';
import { Field } from '../types/Field';



export const FieldContext = createContext<{
  fields: Field[]; // nếu có
  setFields: React.Dispatch<React.SetStateAction<Field[]>>; // nếu có
  selectedField: Field | null;
  setSelectedField: React.Dispatch<React.SetStateAction<Field | null>>;
} | undefined>(undefined);
