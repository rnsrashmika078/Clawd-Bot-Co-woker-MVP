import { ResponseMeta, UsageMetadata } from "@/features/chat/types/chat.types";
import { memo, useState } from "react";
import HoverData from "./HoverData";
interface ModelProps {
  isHuman: boolean;
  response_metadata?: ResponseMeta;
  usageMetadata?: UsageMetadata;
}
const ModelEvaluation = memo(
  ({ isHuman, response_metadata, usageMetadata }: ModelProps) => {
    const [hover, setHover] = useState<boolean>(false);
    if (!usageMetadata) return;
    return (
      !isHuman &&
      response_metadata &&
      response_metadata.done && (
        <div className="flex my-2 gap-1 relative">
          <div
            className="border rounded-2xl text-xs w-fit px-2 text-red-500 cursor-pointer "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {usageMetadata.total_tokens}
          </div>
          <HoverData trigger={hover} usageMetadata={usageMetadata} />
          <div className="border rounded-2xl text-xs w-fit px-2 text-red-500 ">
            {response_metadata.model_provider}
          </div>
          <div className="border rounded-2xl text-xs w-fit px-2 text-red-500 ">
            {response_metadata.model_name}
          </div>
        </div>
      )
    );
  },
);
ModelEvaluation.displayName = "ModelEvaluation";

export default ModelEvaluation;
