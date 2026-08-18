import { Status, StreamMessageStatus } from "../types/chat.types";

export function isCurrentMessage(
  status?: StreamMessageStatus,
  msgId?: string,
  isLoading?: boolean,
) {
  if (status?.messageId === msgId && isLoading) {
    return true;
  }
  return false;
}
