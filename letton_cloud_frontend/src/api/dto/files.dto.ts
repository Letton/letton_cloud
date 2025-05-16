import { User } from "./auth.dto";

export interface FileItem {
  id: string;
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  user: User;
  deletedAt: string | null;
}

export interface FileUploadResponse {
  files: FileItem[];
}

export interface FileUploadProgressEvent {
  file: File;
  progress: number;
}

export type FileType = "all" | "photos" | "trash";
