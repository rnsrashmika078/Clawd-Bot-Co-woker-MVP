import { Thread } from "../types/chat.types";

export async function addThread(thread: Thread) {
  const response = await fetch(`http://localhost:8000/api/threads/add_thread`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      thread_id: thread.thread_id,
      thread_name: thread.thread_name,
    }),
  });
  if (response.ok) {
    const state = await response.json();
    return state.thread;
  }
}
export async function getThreads() {
  const response = await fetch(
    `http://localhost:8000/api/threads/get_threads`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  if (response.ok) {
    const state = await response.json();
    console.log(state);

    return state;
  }
}
