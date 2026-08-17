export const deleteChats = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/thread`, {
      method: "DELETE",
    });
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "error while delete message";
    console.log(message);
    return err;
  }
};
