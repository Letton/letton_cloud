import { FileList } from "@/components/file-list";

export default function Page() {
  return (
    <div>
      <div className="mx-auto container py-6 px-6">
        <h1 className="mb-4 text-xl font-medium">Все файлы</h1>
        <FileList type={"photos"} />
      </div>
    </div>
  );
}
