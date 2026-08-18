import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { StreamMessageStatus } from "@/features/chat/types/chat.types";
import { Message } from "@/shared/components/Message";
import Markdown from "@/shared/components/Markdown";
interface AccordionProps {
  messageId: string;
  status: StreamMessageStatus;
  reasoning_content?: string;
}
const Accordion = memo(
  ({ messageId, reasoning_content, status }: AccordionProps) => {
    const [hidden, setHidden] = useState<boolean>(true);

    const header = {
      finished: "Thought Process",
      loading: "Thinking...",
      streaming: "none",
      idle: "Thought Process",
    };
    if (!reasoning_content) return;
    return (
      <Message align={"start"} onClick={() => setHidden((prev) => !prev)}>
        {/* <span className="fixed bg-red-500 p-5">
          {messageId ?? status?.messageId}
        </span> */}
        <div className="border rounded-2xl bg-accent text-xs w-full ">
          <div className="px-2 py-1 flex w-full font-bold border-b rounded-2xl text-md italic justify-between items-center">
            <div className="flex items-center gap-2 justify-center">
              {/* {isCurrentMessage(status, messageId, "loading") && (
                <PiSpinner className="animate-spin" size={20} />
              )} */}
              <span className="">
                {header["idle"]}
              </span>
            </div>
            <IoMdArrowDropdown size={25} />
          </div>
          <AnimatePresence>
            {!hidden && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-2"
              >
                {status?.messageStatus === "finished" ? (
                  <span>{reasoning_content}</span>
                ) : (
                  <Markdown content={reasoning_content} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Message>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
