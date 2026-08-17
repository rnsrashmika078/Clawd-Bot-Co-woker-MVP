/* eslint-disable react-hooks/set-state-in-effect */
import { lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FetchStreamTransport,
  useStream,
} from "@langchain/langgraph-sdk/react";

import { MdSwitchRight } from "react-icons/md";
import { Message as LCMessage } from "@langchain/core/messages";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Conversation } from "./Conversation";
import { useAppContext } from "@/shared/context/AppContext";
import {
  ExtendedMessage,
  File,
  FormField,
  StreamMessageStatus,
} from "@/features/chat/types/chat.types";
import { deleteChats } from "@/shared/lib/api";
import ErrorCard from "@/shared/components/cards/ErrorCard";
import { InputArea } from "@/shared/components/InputArea";
import { loadThreadHistory } from "../services/chatHistory";
import { v4 as uuid } from "uuid";

const Preview = lazy(() => import("@/features/preview/components/Preview"));

const Chat = memo(() => {
  const [preview, setPreview] = useState<boolean>(false);
  const [currentMessageId, setCurrentMessageId] = useState<string>("");
  const [status, setStatus] = useState<StreamMessageStatus>(null);
  const [messages, setMessages] = useState<LCMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { thread } = useAppContext();

  const transport = useMemo(() => {
    return new FetchStreamTransport({
      apiUrl: "http://localhost:8000/api/stream",
    });
  }, []);

  const stream = useStream({
    transport,
    onMetadataEvent(data) {
      console.log(data);
    },
    threadId: thread,
    onError: (err: unknown) => setError(err as string),
  });

  const onSubmit = useCallback(
    async (data: FormField) => {
      try {
        const id = uuid();
        setCurrentMessageId(id);
        setStatus({
          messageId: id,
          messageStatus: "loading",
        });
        await stream.submit({
          messages: [
            { type: "human", content: data.input },
            ...(file
              ? [
                  {
                    type: "image",
                    content: file?.url ?? "",
                  },
                ]
              : []),
          ],
          threadId: thread,
        });

        if (file) setFile(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "failed to send a message";
        setError(errorMessage);
      }
    },
    [file, stream, thread],
  );

  useEffect(() => {
    if (!thread) {
      setMessages([]);
      setError(null);
      return;
    }
    async function threadHistory() {
      try {
        const history = await loadThreadHistory(thread);
        if (history) {
          setMessages(history);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "failed to load message history",
        );
      }
    }
    threadHistory();
  }, [thread]);

  const allMessages = useMemo(() => {
    const existingIds = new Set(messages.map((msg) => msg.id)); // get all exisiting ids
    const newStreamMessages = stream.messages.filter(
      (m) => !existingIds.has(m.id),
    );

    const lastMessageIndex = newStreamMessages.length - 1;
    const modifiedNewStreamMessages = newStreamMessages.map((m, index) =>
      index === lastMessageIndex && m.type === "ai"
        ? { ...m, customId: currentMessageId }
        : m,
    );
    // const msg = [...newStreamMessages, { customId: currentMessageId }];
    return [...messages, ...modifiedNewStreamMessages] as ExtendedMessage[];
  }, [currentMessageId, messages, stream.messages]);

  // tailwind dynamic styles
  const convPreviewStyle = preview
    ? "flex-1 hidden md:block w-1/2 m-auto"
    : "w-full md:w-1/2 m-auto";

  const flexing =
    allMessages && allMessages.length > 0
      ? "justify-between"
      : "justify-center";

  return (
    <div className="flex w-full h-full scrollbar p-2">
      <Button
        className="fixed right-0"
        onClick={async () => {
          await deleteChats();
        }}
      >
        DELETE
      </Button>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 p-2 z-50">
        <span className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
        <Button
          className={`md:hidden block`}
          onClick={() => {
            setPreview((prev) => !prev);
          }}
        >
          <MdSwitchRight
            className={`transition-all duration-300 ${preview ? "rotate-180" : "rotate-0"}`}
          />
        </Button>
      </div>
      {preview && (
        <div className="flex-1 md:flex-2">
          <Preview />
        </div>
      )}
      <AnimatePresence>
        <motion.div
          className={`${convPreviewStyle} flex relative h-full flex-col ${flexing} `}
        >
          <Conversation messages={allMessages} status={status} />
          {/* <DisplayError error={error} /> */}
          <ErrorCard error={error!} />
          <InputArea
            isLoading={stream.isLoading}
            onSubmit={onSubmit}
            setFile={setFile}
            file={file}
            stop={stream.stop}
            status={status?.messageStatus ?? "idle"}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
Chat.displayName = "Chat";

export default Chat;
