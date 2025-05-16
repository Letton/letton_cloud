"use client";

import { getExtensionFromFilename, isImage } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileCogIcon,
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
} from "lucide-react";
import Link from "next/link";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

import * as api from "@/api/index";
import { toast } from "sonner";
import axios from "axios";

interface IFileCardProps {
  id: string;
  filename: string;
  originalname: string;
}

export function FileCard({ id, originalname, filename }: IFileCardProps) {
  const ext = getExtensionFromFilename(filename);
  const imageUrl =
    ext && isImage(ext)
      ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}files/${filename}`
      : "";

  const getFileIcon = () => {
    if (!ext) return <FileIcon className="h-8 w-8 text-muted-foreground" />;

    if (isImage(ext)) {
      return null;
    }

    if (["mp4", "avi", "mov", "webm"].includes(ext)) {
      return <FileVideoIcon className="h-8 w-8  text-muted-foreground" />;
    }

    if (["mp3", "wav", "ogg", "flac"].includes(ext)) {
      return <FileAudioIcon className="h-8 w-8  text-muted-foreground" />;
    }

    if (["txt", "md", "rtf", "pdf", "doc", "docx"].includes(ext)) {
      return <FileTextIcon className="h-8 w-8  text-muted-foreground" />;
    }

    if (
      [
        "html",
        "css",
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "xml",
        "php",
        "py",
      ].includes(ext)
    ) {
      return <FileCodeIcon className="h-8 w-8  text-muted-foreground" />;
    }

    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return <FileArchiveIcon className="h-8 w-8  text-muted-foreground" />;
    }

    if (["exe", "msi", "app", "apk", "deb"].includes(ext)) {
      return <FileCogIcon className="h-8 w-8 text-muted-foreground" />;
    }

    return <FileIcon className="h-8 w-8 text-muted-foreground" />;
  };

  async function handleShare(id: string) {
    try {
      const { url } = await api.files.share(id);

      await navigator.clipboard.writeText(url);
      toast.info(
        `Ссылка скопирована в буфер обмена (Доступ по ссылке открыт в течении 6 часов)`
      );
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_UPLOADS_URL}files/${filename}`}
      about="blank"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="w-32 h-32 overflow-hidden flex flex-col p-0 gap-0 file"
            data-id={id}
          >
            <CardContent className="flex-grow p-0 flex items-center justify-center overflow-hidden bg-muted/30">
              {imageUrl ? (
                <div className="w-full h-full relative">
                  <img
                    src={imageUrl}
                    alt={originalname}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {getFileIcon()}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-none block p-2 text-xs truncate">
              <p className="w-full truncate text-center font-medium">
                {originalname}
              </p>
            </CardFooter>
          </Card>
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset onClick={() => handleShare(filename)}>
              Поделиться
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuTrigger>
      </ContextMenu>
    </Link>
  );
}
