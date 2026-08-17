import React, { memo } from "react";

const DisplayError = memo(({ error }: { error: string | null }) => {
  if (!error) return;
  return (
    <div className="absolute left-1/2 -top-2 text-center -translate-x-1/2 border border-accent px-2 rounded-t-xl text-red-500 w-[calc(100%-3rem)]">
      {error}
    </div>
  );
});
DisplayError.displayName = "DisplayError";

export default DisplayError;
