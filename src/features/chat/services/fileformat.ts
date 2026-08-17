import { File } from "@/features/chat/types/chat.types";

export type Type = "image" | "file";

export function fileFormat(file: File | null): Type | null {
  if (!file) return null;
  const imageFormat = ["png", "jpg"];
  const fileFormat = ["pdf"];
  if (file.format in imageFormat) {
    return "image";
  }
  if (file.format in fileFormat) {
    return "file";
  }

  return "image";
}
