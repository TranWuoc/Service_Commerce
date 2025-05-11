import axios from "axios";
import { Field } from "../types/Field";


export const fetchFields = async (): Promise<Field[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/fields?per_page=100");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching fields:", error);
    throw error;
  }
};