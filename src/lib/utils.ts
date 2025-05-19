import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function userId() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson);
    return payload.sub || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}