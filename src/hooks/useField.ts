import { useContext } from 'react';
import { FieldContext } from '../Context/FieldContext';

export const useField = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('useField must be used within a FieldProvider');
  }
  return context;
};
