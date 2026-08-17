export async function loadThreadHistory(thread: string) {
  const response = await fetch(`http://localhost:8000/api/threads/${thread}`);
  if (response.ok) {
    const state = await response.json();
    if (state?.values) {
      return state.values;
    }
  }
}
