import { MdOutlineDelete } from "react-icons/md";
import { deleteChats } from "@/features/chat/services/chatOperation";
import { useAppContext } from "@/shared/context/AppContext";
import { memo } from "react";
import { Thread } from "@/features/chat/types/chat.types";
import { triggerChatNotification } from "@/shared/services/ipc";

interface ThreadProps {
  threads: Thread[];
}
const ThreadList = memo(({ threads }: ThreadProps) => {
  const { thread, setThread, setThreads } = useAppContext();
  return (
    <div className="h-[550px] p-2 overflow-y-auto custom-scrollbar-y">
      {threads &&
        threads.map((t) => {
          if (t.thread_status === "temp") {
            return;
          }
          return (
            <div
              onClick={() => {
                setThread(t.thread_id);
              }}
              className={` flex justify-between  items-center px-2 gap-5 mt-1 cursor-pointer transition-all py-2 hover:bg-background rounded-2xl ${
                thread === t.thread_id ? "bg-background" : ""
              } w-full`}
              key={t.thread_id}
            >
              <span className="truncate ">
                {(t.thread_name as string)
                  .trim()
                  .replace(/^"+|"+$/g, "")
                  .trim()}
              </span>
              <MdOutlineDelete
                className="hover:scale-110 transition-all  flex-shrink-0"
                onClick={async () => {
                  setThreads((prev) =>
                    prev.filter((th) => th.thread_id !== t.thread_id),
                  );
                  triggerChatNotification({
                    title: "Chat Delete",
                    body: `${t.thread_name} is successfully deleted!`,
                  });
                  await deleteChats(t.thread_id);
                }}
              />
            </div>
          );
        })}
    </div>
  );
});
ThreadList.displayName = "ThreadList";

export default ThreadList;
