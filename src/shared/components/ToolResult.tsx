import { memo } from "react";

interface ToolProps<T = unknown> {
  visibility: boolean;
  toolResult: T;
}
const ToolResult = memo(({ visibility, toolResult }: ToolProps) => {
  if (visibility) return <div>{JSON.stringify(toolResult)}</div>;
});

ToolResult.displayName = "ToolResult";

export default ToolResult;
