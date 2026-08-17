import { convertDateTime } from "@/helper/message";
import { memo } from "react";

const ThreadSwitchMessage = memo(({ message }: { message: string }) => {
  if (typeof window === undefined) return;
  const modified = message.split("-")[2];
  const modifiedDate = convertDateTime(modified);
  return (
    <div className="relative w-full text-xs flex items-center justify-center">
      <span className="absolute bg-background p-2">Recently connected {modifiedDate}</span>
      <div className="border border-b-0 w-full text-center "></div>
    </div>
  );
});
ThreadSwitchMessage.displayName = "ThreadSwitchMessage";

export default ThreadSwitchMessage;

// user-rejoin-7/11/2026, 3:33:07 AM
