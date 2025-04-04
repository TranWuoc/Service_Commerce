import { FieldApiResponse } from "../types/Field";

export const getFieldInfo = async (
  fieldId: string,
): Promise<FieldApiResponse> => {
  try {
    const response = await fetch(`/api/fields/${fieldId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Failed to fetch field information",
    };
  }
};
