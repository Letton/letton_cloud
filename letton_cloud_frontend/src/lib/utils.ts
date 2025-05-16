import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExtensionFromFilename(filename: string) {
  return filename.split(".").pop();
}

export function isImage(ext: string) {
  return ["jpg", "jpeg", "png", "gif", "heic"].includes(ext);
}
