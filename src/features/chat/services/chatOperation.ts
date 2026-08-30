import { api } from "@/shared/services/api";

export async function loadThreadHistory(thread: string) {
  const response = await api({ route: `/threads/history/${thread}` });
  if (response.ok) {
    const state = await response.json();
    if (state?.values) {
      return state.values;
    }
  }
}
export const deleteChats = async (thread: string) => {
  try {
    const res = await api({
      route: `/thread/${thread}`,

      method: "DELETE",
    });
    const result = await res.json();
    return result;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "error while delete message";
    throw new Error(message);
  }
};
