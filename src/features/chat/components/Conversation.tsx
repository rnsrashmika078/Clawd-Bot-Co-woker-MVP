/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from "react";
import {
  isHumanMessage,
  extractTextContent,
  extractURLContent,
} from "@/features/chat/services/stream";
import {
  ExtendedMessage,
  ResponseMeta,
  StreamMessageStatus,
} from "@/features/chat/types/chat.types";
import Accordion from "@/shared/components/Accordion";
import { Bubble, Message } from "@/shared/components/Message";
import Markdown from "@/shared/components/Markdown";
import { isCurrentMessage } from "../helper/render";

interface ConversationProps {
  messages: ExtendedMessage[] | null;
  status?: StreamMessageStatus;
}
export const Conversation = memo(({ messages, status }: ConversationProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null); // ref for scroll to bottom cotnrl

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!bottomRef.current) return;
    if (status?.messageId === "finished") {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [status]);

  if (!messages) return null;
  return (
    <div className="flex flex-col p-5 w-full gap-6 text-sm ">
      {messages.map((msg) => {
        const isHuman = isHumanMessage(msg); // check weather the message is human message or ai
        const content = extractTextContent(msg.content); // extract text content from langchain object
        const url = extractURLContent(msg.content); // extract text content from langchain object

        return (
          <div key={msg.id}>
            {/* Reasoning content */}
            <Accordion
              messageId={msg.customId!}
              status={status!}
              reasoning_content={msg.additional_kwargs?.reasoning_content}
            />
            {/* render human and ai messages  */}
            <Message align={isHuman ? "end" : "start"}>
              <div className="">
                <div className="mt-2 mb-2">
                  {/* will replace this with Image element */}
                  {url && isHuman && (
                    <img
                      src={url ?? ""}
                      width={50}
                      height={50}
                      alt="attached_image"
                      className="w-32 h-32 min-w-full rounded-xl"
                    />
                  )}
                </div>
                <Bubble variant={isHuman ? "human" : "ai"}>
                  {isCurrentMessage(status, msg.customId, "loading") ? (
                    <span>{content}</span>
                  ) : (
                    <Markdown content={content} isHuman={isHuman} />
                  )}
                </Bubble>
              </div>
            </Message>
            {!isHuman && status?.messageStatus === "finished" && (
              <div className="flex my-2 gap-1">
                <div className="border rounded-2xl text-xs w-fit px-2 text-red-500 ">
                  {msg.usage_metadata?.total_tokens}
                </div>
                <div className="border rounded-2xl text-xs w-fit px-2 text-red-500 ">
                  {(
                    msg?.response_metadata as ResponseMeta
                  )?.model_provider?.toUpperCase()}
                </div>
                <div className="border rounded-2xl text-xs w-fit px-2 text-red-500 ">
                  {(msg?.response_metadata as ResponseMeta)?.model_name}
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>
        );
      })}
    </div>
  );
});
Conversation.displayName = "Conversation";
