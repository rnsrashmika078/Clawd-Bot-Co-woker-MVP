import { Status, StreamMessageStatus } from "../types/chat.types";

export function isCurrentMessage(
  status?: StreamMessageStatus,
  msgId?: string,
  checkState?: Status,
) {
  if (status?.messageId === msgId && status?.messageStatus === checkState) {
    return true;
  }
  return false;
}
