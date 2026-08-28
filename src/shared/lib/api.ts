export const deleteChats = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`, {
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
