import { FetchStreamTransport } from "@langchain/langgraph-sdk/react";

export const transport = new FetchStreamTransport({
  apiUrl: "http://localhost:8000/api/stream",
});
