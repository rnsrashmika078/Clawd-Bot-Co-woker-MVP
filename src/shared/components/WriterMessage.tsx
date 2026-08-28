import { CustomWriterMessage } from "@/features/chat/types/chat.types";
import { memo } from "react";
import { LiaCircleNotchSolid } from "react-icons/lia";

interface WriterProps<T = Record<string, unknown>> {
  writerMessage: CustomWriterMessage | null;
  customId: string | undefined;
  responseMetadata?: T;
}

const WriterMessage = memo(
  ({ writerMessage, customId, responseMetadata }: WriterProps) => {
    if (!writerMessage && !customId) return;

    const isFinished = responseMetadata && responseMetadata.done;

    if (isFinished || !writerMessage) return;
    return (
      writerMessage &&
      writerMessage.messageId === customId && (
        <span
          className={`sticky italic font-bold  top-0 flex items-center gap-2 mb-2 text-foreground bg-background p-2 rounded-xl ${isFinished ? "animate-none" : "animate-pulse"}`}
        >
          <LiaCircleNotchSolid
            size={20}
            className={isFinished ? "animate-none" : "animate-spin"}
          />{" "}
          {writerMessage.message}
        </span>
      )
    );
  },
);

WriterMessage.displayName = "WriterMessage";

export default WriterMessage;
