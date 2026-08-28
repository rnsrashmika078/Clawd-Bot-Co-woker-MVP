import { UseFormRegister } from "react-hook-form";
import { Message as LCMessage } from "@langchain/core/messages";

export type ChatMessage = {
  content?: string;
  type?: string;
  url?: string;
};

export type CustomWriterMessage = {
  message: string;
  messageId: string;
};
export type File = {
  url: string;
  format?: "image" | "file";
};
export type FormField = {
  input: string;
};
export type UsageMetadata = {
  input_token_details: object;
  input_tokens: number;
  output_token_details: object;
  output_tokens: number;
  total_tokens: number;
};
export type ResponseMeta<T = unknown> = {
  model_provider: string;
  model_name: string;
  model: string;
  done: boolean;
  done_reason: T;
  created_at: Date;
  eval_count: number;
  eval_duration: number;
  load_duration: number;
  logprobs: T;
  total_duration: number;
  prompt_eval_duration: number;
  prompt_eval_count: number;
};
export type RegisterType = UseFormRegister<FormField>;

export interface ExtendedMessage extends LCMessage, TMessage {}
export type TMessage = {
  additional_kwargs?: {
    reasoning_content?: string;
  };
  customId?: string;

  progress?: { message: string };
  tool_call_id?: string;
  invalid_tool_calls?: [];
  tool_call_chunks?: [
    {
      args: string;
      id: string;
      name: string;
      index: number;
      type: string;
    },
  ];
  tool_calls?: [
    {
      args: object;
      id: string;
      name: string;
      type: string;
    },
  ];
  usage_metadata?: {
    input_token_details: object;
    input_tokens: number;
    output_token_details: object;
    output_tokens: number;
    total_tokens: number;
  };
  status?: string;
};
export type Status = "loading" | "streaming" | "finished" | "idle";
export type StreamMessageStatus = {
  messageId: string;
  messageStatus: Status;
} | null;
