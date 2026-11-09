import { File } from "@/features/chat/types/chat.types";

export type Type = "image" | "file";

export function fileFormat(file: File | null): Type | null {
  if (!file?.format) return null;
  if (["png", "jpg", "jpeg", "webp"].includes(file.format)) {
    return "image";
  }
  if (file.format === "pdf") {
    return "file";
  }

  return "image";
}
