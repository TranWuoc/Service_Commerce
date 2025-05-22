
export interface TimeSlot {
  value: string;
  label: string;
  startHour: number;
  endHour: number;
}

export interface Field {
  id: number;
  name: string;
}

export interface BookingFormData {
  name: string;
  fieldId: string;
  date: string;
  timeSlot: string;
}
