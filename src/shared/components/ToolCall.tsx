/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";

interface ToolCallItem {
  name: string;
  args: { path: string; pattern: string };
  id: string;
  type: string;
}

interface ToolProps {
  visibility: boolean;
  ToolCall: any
}

const ToolCall = memo(({ visibility, ToolCall }: ToolProps) => {
  if (visibility && ToolCall && ToolCall.length > 0) {
    return (
      <div className="p-2 border mt-2 rounded-2xl overflow-x-auto w-full">
        {ToolCall.map((result: ToolCallItem, idx: number) => (
          <div key={idx} className="gap-2 p-1">
            <span className="font-bold italic">{result.name}</span>
            <div className="flex w-full">
              <span className="">{result.args.path}</span>
              <span className="ml-2"> - {result.args.pattern}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

ToolCall.displayName = "ToolCall";

export default ToolCall;
