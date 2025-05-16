"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X, Check, Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import * as api from "@/api";
import { FileItem } from "@/api/dto/files.dto";
import { Progress } from "./ui/progress";
import { useSWRConfig } from "swr";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export function FileUploadButton() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});
  const [uploadedFiles, setUploadedFiles] = React.useState<FileItem[]>([]);
  const { mutate } = useSWRConfig();

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress({});

    try {
      const response = await api.files.upload(files, (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          const newProgress: Record<string, number> = {};
          files.forEach((file) => {
            newProgress[file.name] = progress;
          });

          setUploadProgress(newProgress);
        }
      });
      if (response && response.files) {
        setUploadedFiles(response.files);
        toast.success(`${files.length} files uploaded successfully`);
        mutate((key) => typeof key === "string" && key.startsWith("/files"));
      } else {
        console.error("Invalid response format:", response);
        toast.error("Received invalid response from server");
      }
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Загрузить файлы</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Загрузить файлы</DrawerTitle>
            <DrawerDescription>Выберите файлы для загрузки</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 w-full max-w-sm p-4">
            <FileUpload
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
              className="w-full"
              value={files}
              onValueChange={setFiles}
              onFileReject={onFileReject}
              multiple
              disabled={isUploading}
            >
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">
                    Перетащите файлы сюда...
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Или кликните чтобы выбрать (max 10 файлов, до 5MB каждый)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-fit"
                    disabled={isUploading}
                  >
                    Выбрать файлы...
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                {files.map((file, index) => {
                  const progress = uploadProgress[file.name] || 0;

                  return (
                    <FileUploadItem key={index} value={file}>
                      <FileUploadItemPreview />
                      <div className="flex flex-col flex-1">
                        <FileUploadItemMetadata />
                        {isUploading && <Progress value={progress} />}
                      </div>
                      {isUploading ? (
                        progress === 100 ? (
                          <div className="size-7 flex items-center justify-center">
                            <Check className="size-4 text-green-500" />
                          </div>
                        ) : (
                          <div className="size-7 flex items-center justify-center">
                            <Loader2 className="size-4 animate-spin" />
                          </div>
                        )
                      ) : (
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <X />
                          </Button>
                        </FileUploadItemDelete>
                      )}
                    </FileUploadItem>
                  );
                })}
              </FileUploadList>
            </FileUpload>

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  Недавно загруженные файлы:
                </h3>
                <ul className="text-xs space-y-1">
                  {uploadedFiles.map((file) => (
                    <li key={file.id} className="flex items-center gap-2">
                      <Check className="size-4 text-green-500" />
                      <span className="flex-1 truncate">
                        {file.originalname}
                      </span>
                      <span className="text-muted-foreground">
                        {(file.size / 1024).toFixed(1)}KB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DrawerFooter>
            {files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Загрзука...
                  </span>
                ) : (
                  "Загрузить файлы"
                )}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Отмена</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
