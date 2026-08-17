import Pdf from "@/public/images/pdf.png";
import { memo } from "react";
import { fileFormat } from "@/features/chat/services/fileformat";
import { File } from "@/features/chat/types/chat.types";
const ImagePreview = memo(({ file }: { file: File | null }) => {
  if (!file) return;
  const format = fileFormat(file);

  if (format === "file")
    return (
      <img
        src={"Pdf"}
        width={96}
        height={96}
        className="w-24 h-24 rounded-xl"
        alt="attach_image"
      />
    );

  return (
    <img
      src={"Pdf"}
      width={96}
      height={96}
      className="w-24 h-24 rounded-xl"
      alt="attach_image"
    />
  );
});
ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
