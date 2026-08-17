import React, { memo } from "react";

const ImageSkeleton = memo(() => {
  return <div className="w-24 h-24 bg-zinc-800 rounded-xl animate-pulse"></div>;
});
ImageSkeleton.displayName = "ImageSkeleton";

export default ImageSkeleton;
