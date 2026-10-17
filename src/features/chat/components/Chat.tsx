import { useStream } from "@langchain/langgraph-sdk/react";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { memo, useCallback, useEffect, useRef, useState } from "react";

import {
	ExtendedMessage,
	File,
	FormField,
	StreamMessageStatus,
} from "@/features/chat/types/chat.types";
import { InputArea } from "@/shared/components/InputArea";
import ErrorCard from "@/shared/components/cards/ErrorCard";
import { useAppContext } from "@/shared/context/AppContext";
import { triggerChatNotification } from "@/shared/services/ipc";
import type { Message as LCMessage } from "@langchain/core/messages";
import { v4 as uuid } from "uuid";
import { transport } from "../helper/langchainTransport";
import { useStableMessages } from "../hooks/useStableMessages";
import { loadThreadHistory } from "../services/chatOperation";
import { addThread } from "../services/threadList";
import { Conversation } from "./Conversation";

const Chat = memo(() => {
	const currentMessageRef = useRef<string | null>("");
	const [currentMessageId, setCurrentMessageId] = useState<string>("");
	const [status, setStatus] = useState<StreamMessageStatus>(null);
	const [messages, setMessages] = useState<LCMessage[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const { thread, setThreads } = useAppContext();

	const [writerMessage, setWriterMessage] = useState<any | null>(null);

	const handleCustomWriterMessage = useCallback(
		async (data: any) => {
			if (data.title) {
				triggerChatNotification({
					title: data.title,
					body: "You have new chat created!",
				});
				// await new Promise((resolve) => setTimeout(resolve, 5000));
				const newThread = await addThread({
					thread_id: thread,
					thread_name: data.title,
					thread_status: "confirm",
				});
				setThreads((prev) => [
					...prev,

					{
						thread_id: newThread.thread_id,
						thread_name: newThread.thread_name,
					},
				]);
				return;
			}
			setWriterMessage({
				message: data.message,
				messageId: currentMessageRef.current!,
			});
		},
		[setThreads, thread],
	);

	const stream = useStream({
		transport,
		throttle: 10,
		onCustomEvent: handleCustomWriterMessage,
		threadId: thread,
		onError: (err: unknown) => setError(JSON.stringify(err)),
	});

	const streamRef = useRef(stream);
	useEffect(() => {
		streamRef.current = stream;
	}, [stream]);

	const onSubmit = useCallback(
		async (data: FormField) => {
			try {
				const id = uuid();
				currentMessageRef.current = id;
				setCurrentMessageId(id);
				setStatus({
					messageId: id,
					messageStatus: "loading",
				});

				setThreads((prev) =>
					prev.map((t) =>
						t.thread_id === thread ? { ...t, thread_status: "confirm" } : t,
					),
				);

				await streamRef.current.submit({
					messages: [
						{ type: "human", content: data.input },
						...(file
							? [
									{
										type: "image",
										content: file?.url ?? "",
									},
								]
							: []),
					],
					threadId: thread,
				});

				if (file) setFile(null);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "failed to send a message";
				setError(errorMessage);
			}
		},
		[file, setThreads, thread],
	);

	const handleSubmit = useCallback(
		(data: FormField) => {
			onSubmit(data);
			setError(null);
		},
		[onSubmit],
	);

	const handleStop = useCallback(() => {
		streamRef.current.stop();
	}, []);

	useEffect(() => {
		setCurrentMessageId("");
		if (!thread) {
			setMessages([]);
			setError(null);
			return;
		}
		async function threadHistory() {
			try {
				const history = await loadThreadHistory(thread);
				if (history) {
					setMessages(history);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "failed to load message history",
				);
			}
		}
		threadHistory();
	}, [thread]);

	const allMessages: ExtendedMessage[] = useStableMessages(
		messages,
		stream.messages,
		currentMessageId,
	);

	const flexing =
		allMessages && allMessages.length > 0
			? "justify-between"
			: "justify-center";

	const tokenCount = allMessages.reduce(
		(acc, item: ExtendedMessage) =>
			acc + (item?.usage_metadata?.total_tokens ?? 0),
		0,
	);

	return (
		<div className="flex h-full w-full overflow-hidden p-2 custom-scrollbar-y">
			<div className={`relative flex h-full w-full flex-col ${flexing}`}>
				<Conversation
					writerMessage={writerMessage}
					messages={allMessages}
					status={status}
					isLoading={stream.isLoading}
				/>
				<ErrorCard error={error!} />
				<InputArea
					tokenCount={tokenCount}
					isLoading={stream.isLoading}
					onSubmit={handleSubmit}
					setFile={setFile}
					file={file}
					stop={handleStop}
					status={status?.messageStatus ?? "idle"}
				/>
			</div>
		</div>
	);
});
Chat.displayName = "Chat";

export default Chat;
