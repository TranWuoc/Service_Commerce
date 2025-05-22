
import axiosInstance from "../api/axiosInstance";

export const fetchAllFields = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/fields");
    return response.data.data.filter(
      (field: any) => field.state?.id === "state-001"
    );
  } catch (error) {
    console.error("Lỗi khi gửi request:", error);
    return [];
  }
};

export const fetchFields = async (
  lat: string | null,
  lng: string | null,
  categoryId: string | null
): Promise<any[]> => {
  try {
    const params = new URLSearchParams();
    if (categoryId) params.append("category_id", categoryId);
    if (lat && lng) {
      params.append("latitude", lat);
      params.append("longitude", lng);
    }
    params.append("page", "1");

    const response = await axiosInstance.post(`/fields/filter?${params.toString()}`);
    return response.data.data.filter(
      (field: any) => field.state?.id === "state-001"
    );
  } catch (error) {
    return fetchAllFields();

  }
};

export const getLocation = (): Promise<{ lat: string; lng: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString(),
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  });
};
