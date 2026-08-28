import { UsageMetadata } from "@/features/chat/types/chat.types";

interface HoverProp {
  trigger: boolean;
  usageMetadata: UsageMetadata;
}
const HoverData = ({ trigger, usageMetadata }: HoverProp) => {
  if (trigger)
    return (
      <div className="absolute -top-14 bg-destructive p-2 flex flex-col border rounded-md text-xs w-fit px-2 text-yellow-500 ">
        <span>Input Token: {usageMetadata.input_tokens}</span>
        <span>Output Token: {usageMetadata.output_tokens}</span>
      </div>
    );
};

export default HoverData;
