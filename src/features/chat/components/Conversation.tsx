
import { memo, useEffect, useRef,  } from "react";
import {
  isHumanMessage,
  extractTextContent,
  extractURLContent,
  isToolMessage,
} from "@/features/chat/services/stream";
import {
  CustomWriterMessage,
  ExtendedMessage,
  ResponseMeta,
  StreamMessageStatus,
} from "@/features/chat/types/chat.types";
import Accordion from "@/shared/components/Accordion";
import { Bubble, Message } from "@/shared/components/Message";
import Markdown from "@/shared/components/Markdown";
import WriterMessage from "@/shared/components/WriterMessage";
import ModelEvaluation from "@/shared/components/ModelEvaluation";
import ToolResult from "@/shared/components/ToolResult";

interface ConversationProps {
  messages: ExtendedMessage[] | null;
  status?: StreamMessageStatus;
  isLoading?: boolean;
  writerMessage: CustomWriterMessage | null;
}
export const Conversation = memo(
  ({ messages, status, isLoading, writerMessage }: ConversationProps) => {
    const bottomRef = useRef<HTMLDivElement | null>(null); // ref for scroll to bottom cotnrl

    useEffect(() => {
      if (!bottomRef.current) return;
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    useEffect(() => {
      if (!bottomRef.current) return;
      if (status?.messageId === "finished") {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [status]);

    if (!messages) return null;
    return (
      <div className="flex flex-col p-10 w-full gap-4 text-sm ">
        {messages.map((msg) => {
          const isTool = isToolMessage(msg);
          const isHuman = isHumanMessage(msg); // check weather the message is human message or ai
          const content = extractTextContent(msg.content); // extract text content from langchain object
          const url = extractURLContent(msg.content); // extract text content from langchain object

          // if (msg.type === "tool") return;
          return (
            <div key={msg.id}>
              {/* Writer message */}
              <WriterMessage
                responseMetadata={msg.response_metadata}
                writerMessage={writerMessage}
                customId={msg.customId}
              />
              {/* Reasoning content */}
              <Accordion
                messageId={msg.customId}
                status={status}
                reasoning_content={msg.additional_kwargs?.reasoning_content}
              />
              {/* tool result */}
              <ToolResult visibility={isTool} toolResult={msg.content} />
              {/* render human and ai messages  */}
              <Message align={isHuman ? "end" : "start"}>
                <div className="">
                  <div className="mt-2 mb-2 flex items-end justify-end">
                    {/* will replace this with Image element */}
                    {/* {url} */}
                    {url && isHuman && (
                      <img
                        src={url ?? ""}
                        width={128}
                        height={128}
                        alt="attached_image"
                        className="w-32 h-32"
                      />
                    )}
                  </div>
                  {!isTool && (
                    <Bubble variant={isHuman ? "human" : "ai"}>
                      {/* {isCurrentMessage(status, msg.customId, isLoading) ? (
                        <span>{content}</span>
                      ) : ( */}
                        <Markdown content={content} isHuman={isHuman} />
                      {/* )} */}
                    </Bubble>
                  )}
                </div>
              </Message>

              {/* model evaluation metrics */}
              <ModelEvaluation
                isHuman={isHuman}
                response_metadata={msg.response_metadata as ResponseMeta}
                usageMetadata={msg.usage_metadata}
              />
              <div ref={bottomRef}></div>
            </div>
          );
        })}
      </div>
    );
  },
);
Conversation.displayName = "Conversation";
