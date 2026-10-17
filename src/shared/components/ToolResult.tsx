/* eslint-disable @typescript-eslint/no-explicit-any */

import { setChatFiles } from "@/redux/slice/chatFileSlice";
import { AppDispatch } from "@/redux/store";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppContext } from "../context/AppContext";

interface ToolProps {
  visibility: boolean;
  toolResult: any;
  toolName: string | undefined;
}
const ToolResult = memo(({ visibility, toolName, toolResult }: ToolProps) => {
  const [parsed, setParsed] = useState<any | null>(null);
  const { thread } = useAppContext();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const func = () => {
      try {
        const parsed = JSON.parse(toolResult);
        setParsed(parsed);
        if (parsed.output_file_path) {
          const rawPath = String(parsed.output_file_path).trim();
          const match = rawPath.match(/[A-Za-z]:\\[^\r\n]*/);
          const filePath = (match ? match[0] : rawPath).trim();
          const fileName = filePath.split("\\").pop() ?? filePath;
          dispatch(
            setChatFiles({
              files: [{ fileName: fileName, filePath: filePath }],
              threadId: thread,
            }),
          );
        }
      } catch (e) {
        // console.log(e);
      }
    };
    func();
  }, [toolResult]);

  if (!parsed || !visibility) return;

  return (
    <div className="p-5 border rounded-2xl overflow-x-auto w-full custom-scrollbar-x">
      <span className="font-bold italic">{toolName}</span>
      <div className="flex w-full mt-2 ">
        <span className="px-2">{parsed.output_file_path}</span>
      </div>
    </div>
  );
  return null;
});

ToolResult.displayName = "ToolResult";

export default ToolResult;
