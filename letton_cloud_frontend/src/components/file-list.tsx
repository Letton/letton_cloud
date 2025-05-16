"use client";

import { FileItem } from "@/api/dto/files.dto";
import { FileCard } from "./file-card";
import * as api from "@/api/index";
import useSWR, { useSWRConfig } from "swr";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { CodeXml, Search, Trash2 } from "lucide-react";
import Selecto from "react-selecto";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface IFileListProps {
  showDeleteButton?: boolean;
  type: "trash" | "photos" | "all";
}

type FileSelectType = "select" | "unselect";

export function FileList({
  showDeleteButton = true,
  type = "all",
}: IFileListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filesContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { mutate } = useSWRConfig();

  const onFileSelect = (id: string, type: FileSelectType) => {
    if (type === "select") {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((_id) => _id !== id));
    }
  };
  const { mutate: globalMutate } = useSWRConfig();

  const handleDeleteSelected = async () => {
    try {
      await api.files.remove(selectedIds);
      setSelectedIds([]);
      // Используем глобальную мутацию вместо локальной
      globalMutate(`/files?type=${type}`);
    } catch (error) {
      console.error("Failed to delete selected files:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const { data, isLoading } = useSWR<FileItem[]>(
    `/files?type=${type}`,
    async () => {
      return await api.files.getAll(type);
    }
  );

  // Обновляем данные при изменении типа файлов
  useEffect(() => {
    // Используем текущий ключ кэша
    mutate(`/files?type=${type}`);
  }, [type, mutate]);

  if (isLoading)
    return (
      <div className="flex flex-wrap gap-4">
        <Skeleton className="w-32 h-32 rounded-xl" />
        <Skeleton className="w-32 h-32 rounded-xl" />
        <Skeleton className="w-32 h-32 rounded-xl" />
        <Skeleton className="w-32 h-32 rounded-xl" />
        <Skeleton className="w-32 h-32 rounded-xl" />
      </div>
    );

  const filteredFiles = data
    ? data.filter(
        (file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.originalname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showDeleteButton && selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Удалить выбранное ({selectedIds.length})
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4" ref={filesContainerRef}>
        {filteredFiles.length > 0 ? (
          filteredFiles.map((item) => (
            <FileCard
              id={item.id}
              filename={item.filename}
              originalname={item.originalname}
              key={item.id}
            />
          ))
        ) : searchQuery ? (
          <p className="text-muted-foreground flex gap-2 items-center-">
            Ничего не найдено
            <CodeXml />
          </p>
        ) : (
          <p>Вы еще не загрузили ни одного файла.</p>
        )}
        {mounted && (
          <Selecto
            container={filesContainerRef.current}
            selectableTargets={[".file"]}
            selectByClick
            hitRate={10}
            selectFromInside
            toggleContinueSelect={["shift"]}
            continueSelect={false}
            onSelect={(e) => {
              e.added.forEach((el) => {
                el.classList.add("active");
                onFileSelect(String(el.dataset["id"]), "select");
              });
              e.removed.forEach((el) => {
                el.classList.remove("active");
                onFileSelect(String(el.dataset["id"]), "unselect");
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
