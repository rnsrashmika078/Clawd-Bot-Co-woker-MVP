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
    threads &&
    threads.map((t) => {
      if (t.thread_status === "temp") {
        return;
      }
      return (
        <div
          onClick={() => {
            setThread(t.thread_id);
          }}
          className={`  flex justify-between items-center px-4 mt-1 cursor-pointer transition-all py-2 hover:bg-background rounded-2xl ${
            thread === t.thread_id ? "bg-background" : ""
          } w-full`}
          key={t.thread_id}
        >
          {(t.thread_name as string).trim().replace(/^"+|"+$/g, '').trim()}
          <MdOutlineDelete
            className="hover:scale-110 transition-all"
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
    })
  );
});
ThreadList.displayName = "ThreadList";

export default ThreadList;
