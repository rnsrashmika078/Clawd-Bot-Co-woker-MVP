/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIMessage } from "@langchain/core/messages";

export function isAIMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;

  const msg = message as Record<string, unknown>;

  if (msg.type === "ai") return true;

  return AIMessage.isInstance(message);
}

export function isToolMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;

  const msg = message as Record<string, unknown>;

  return msg.type === "tool";
}

export function isHumanMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;

  const msg = message as Record<string, unknown>;

  return msg.type === "human";
}

export function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "text" in item) {
          return String(item.text);
        }
        // if (item && typeof item === "object" && "image_url" in item) {
        //   return String(item.image_url.url);
        // }
      })
      .join("");
  }

  if (content && typeof content === "object" && "text" in content) {
    return String(content.text);
  }

  return String(content || "");
}
export function extractURLContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "image_url" in item) {
          return String(item.image_url.url);
        }
      })
      .join("");
  }

  if (content && typeof content === "object" && "text" in content) {
    return String(content.text);
  }

  return String(content || "");
}

export function extractToolCalls(toolCall: any) {
  if (!Array.isArray(toolCall)) return;
  const calls = toolCall.map((t) => {
    if (t.args.todos) return t.args.todos;
    if (t.args) return t.args;
  });

  return calls;
}
