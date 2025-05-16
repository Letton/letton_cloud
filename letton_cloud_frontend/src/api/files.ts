import axios from "@/core/axios";
import { FileItem, FileType, FileUploadResponse } from "./dto/files.dto";
import { AxiosProgressEvent } from "axios";

export const getAll = async (type: FileType = "all"): Promise<FileItem[]> => {
  return (await axios.get(`/files?type=${type}`)).data;
};

export const remove = async (ids: string[]): Promise<{ success: boolean }> => {
  return (await axios.delete(`/files?ids=${ids.join(",")}`)).data;
};

export const restore = async (ids: number[]): Promise<{ success: boolean }> => {
  return (await axios.post(`/files/restore`, { ids })).data;
};

export const share = async (id: string): Promise<{ url: string }> => {
  return (await axios.post(`/files/${id}/share`)).data;
};

export const upload = async (
  files: File[],
  onProgress?: (event: AxiosProgressEvent) => void
): Promise<FileUploadResponse> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (onProgress) {
        onProgress(event);
      }
    },
  };

  try {
    const { data } = await axios.post("files", formData, config);
    if (!data.files) {
      return { files: Array.isArray(data) ? data : [data] };
    }
    return data as FileUploadResponse;
  } catch (error) {
    console.log(error);
  } finally {
    return { files: [] };
  }
};

export const downloadFile = async (fileId: number): Promise<Blob> => {
  const response = await axios.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const getFileDetails = async (fileId: number): Promise<FileItem> => {
  return (await axios.get(`/files/${fileId}`)).data;
};
