import { api } from "@/shared/services/api";
import { Thread } from "../types/chat.types";

export async function addThread(thread: Thread) {
  const response = await api({
    route: "/threads/add_thread",
    method: "POST",
    body: {
      thread_id: thread.thread_id,
      thread_name: thread.thread_name,
    },
  });
  if (response.ok) {
    const state = await response.json();
    return state.thread;
  }
}
export async function getThreads() {
  const response = await api({ route: "/threads/get_threads" });
  if (response.ok) {
    const state = await response.json();
    return state;
  }
}
