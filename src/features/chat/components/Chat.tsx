/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  CustomWriterMessage,
  ExtendedMessage,
  File,
  FormField,
  ResponseMeta,
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

  const currentMessageRef = useRef<string | null>("");
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

  const [writerMessage, setWriterMessage] =
    useState<CustomWriterMessage | null>(null);

  const handleCustomWriterMessage = (data: any) => {
    setWriterMessage({
      message: data.message,
      messageId: currentMessageRef.current!,
    });
  };

  const stream = useStream({
    transport,
    onMetadataEvent(data) {},
    onCustomEvent: handleCustomWriterMessage,
    threadId: thread,
    onError: (err: unknown) => setError(JSON.stringify(err)),
  });

  const onSubmit = useCallback(
    async (data: FormField) => {
      try {
        const id = uuid();
        currentMessageRef.current = id;
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
    return [...messages, ...modifiedNewStreamMessages] as ExtendedMessage[];
  }, [currentMessageId, messages, stream.messages]);

  // const allMessages = useMemo(() => {
  //   // const lastMessage = stream.messages.at(-1) as LCMessage;
  //   return stream.messages;
  // }, [stream.messages]);

  console.log("all message", allMessages);
  console.log("Stream all message", stream.messages.length);
  // tailwind dynamic styles
  const convPreviewStyle = preview
    ? "flex-1 hidden md:block w-1/2 m-auto"
    : "w-full md:w-1/2 m-auto";

  const flexing =
    allMessages && allMessages.length > 0
      ? "justify-between"
      : "justify-center";

  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    if (!allMessages) return;
    const lastMessage = allMessages[allMessages.length - 1];

    if ((lastMessage?.response_metadata as ResponseMeta)?.done) {
      setTokenCount(
        allMessages?.reduce(
          (acc, item: ExtendedMessage) =>
            (acc + (item?.usage_metadata?.total_tokens ?? 0)) as number,
          0,
        ),
      );
    }
  }, [allMessages]);
  return (
    <div className="flex w-full h-full scrollbar p-2">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 p-2 z-50">
        <span className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
        <div className="flex gap-2">
          <Button
            size={"sm"}
            // className={`md:hidden block`}
            onClick={() => {
              setPreview((prev) => !prev);
            }}
          >
            <MdSwitchRight
              className={`transition-all duration-300 ${preview ? "rotate-180" : "rotate-0"}`}
            />
          </Button>
          <Button
            size={"sm"}
            // className={`md:hidden block`}
            onClick={async () => {
              await deleteChats();
            }}
          >
            DELETE
          </Button>
        </div>
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
          <Conversation
            writerMessage={writerMessage}
            messages={allMessages}
            status={status}
            isLoading={stream.isLoading}
          />
          <ErrorCard error={error!} />
          <InputArea
            tokenCount={tokenCount}
            isLoading={stream.isLoading}
            onSubmit={(data) => {
              onSubmit(data);
              setError(null);
            }}
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
