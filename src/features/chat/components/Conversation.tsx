import { memo, useCallback, useEffect, useRef } from "react";
import {
	isHumanMessage,
	extractTextContent,
	extractURLContent,
	isToolMessage,
} from "@/features/chat/services/stream";
import {
	CustomWriterMessage,
	ExtendedMessage,
	ResponseMeta,
	StreamMessageStatus,
} from "@/features/chat/types/chat.types";
import Accordion from "@/shared/components/Accordion";
import { Bubble, Message } from "@/shared/components/Message";
import Markdown from "@/shared/components/Markdown";
import WriterMessage from "@/shared/components/WriterMessage";
import ModelEvaluation from "@/shared/components/ModelEvaluation";
import ToolCall from "@/shared/components/ToolCall";
import ToolResult from "@/shared/components/ToolResult";

const BOTTOM_THRESHOLD = 64;

function getScrollers(node: HTMLElement | null): HTMLElement[] {
	const scrollers: HTMLElement[] = [];
	let current = node?.parentElement ?? null;
	while (current) {
		const { overflowY } = window.getComputedStyle(current);
		if (
			overflowY === "auto" ||
			overflowY === "scroll" ||
			overflowY === "overlay"
		) {
			scrollers.push(current);
		}
		current = current.parentElement;
	}
	return scrollers;
}

function isScrolledToBottom(scroller: HTMLElement) {
	return (
		scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <=
		BOTTOM_THRESHOLD
	);
}


function useStickToBottom(dep: unknown) {
	const endRef = useRef<HTMLDivElement | null>(null);
	const pinnedRef = useRef(true);
	const boundRef = useRef<HTMLElement[]>([]);
	const lastDepRef = useRef<unknown>(dep);

	const sync = useCallback((smooth: boolean) => {
		const scrollers = getScrollers(endRef.current);
		if (!scrollers.length) return;

		const shouldStick = pinnedRef.current;
		for (const scroller of scrollers) {
			if (shouldStick) {
				scroller.scrollTo({
					top: scroller.scrollHeight,
					behavior: smooth ? "smooth" : "auto",
				});
			} else if (!isScrolledToBottom(scroller)) {
				pinnedRef.current = false;
				return;
			}
		}
	}, []);

	useEffect(() => {
		if (lastDepRef.current === dep) return;
		lastDepRef.current = dep;
		sync(false);
	}, [dep, sync]);

	useEffect(() => {
		const onScroll = () => {
			const scrollers = getScrollers(endRef.current);
			pinnedRef.current = scrollers.every(isScrolledToBottom);
		};

		const attach = () => {
			const next = getScrollers(endRef.current);
			const previous = boundRef.current;
			if (
				next.length === previous.length &&
				next.every((el, i) => el === previous[i])
			) {
				return;
			}
			for (const el of previous) el.removeEventListener("scroll", onScroll);
			for (const el of next)
				el.addEventListener("scroll", onScroll, { passive: true });
			boundRef.current = next;
		};

		attach();
		const observer = new ResizeObserver(attach);
		if (endRef.current?.parentElement) {
			observer.observe(endRef.current.parentElement);
		}

		return () => {
			observer.disconnect();
			for (const el of boundRef.current)
				el.removeEventListener("scroll", onScroll);
			boundRef.current = [];
		};
	}, []);

	return { endRef, sync };
}

interface MessageRowProps {
	msg: ExtendedMessage;
	writerMessage: CustomWriterMessage | null;
	status?: StreamMessageStatus;
}


const MessageRow = memo(
	({ msg, writerMessage, status }: MessageRowProps) => {
		const isTool = isToolMessage(msg);
		const isHuman = isHumanMessage(msg); // check weather the message is human message or ai
		const content = extractTextContent(msg.content); // extract text content from langchain object
		const url = extractURLContent(msg.content); // extract text content from langchain object

		return (
			<div>
				{/* Writer message */}
				<WriterMessage
					responseMetadata={msg.response_metadata}
					writerMessage={writerMessage}
					customId={msg.customId}
				/>
				{/* Reasoning content */}
				<Accordion
					messageId={msg.customId}
					status={status}
					reasoning_content={msg.additional_kwargs?.reasoning_content}
				/>
				<ToolCall visibility={!!msg.tool_calls} ToolCall={msg.tool_calls} />
				{/* tool result */}
				<ToolResult
					visibility={isTool}
					toolResult={msg.content!}
					toolName={msg.name}
				/>
				{/* render human and ai messages  */}
				<Message align={isHuman ? "end" : "start"}>
					<div className="">
						<div className="mt-2 mb-2 flex items-end justify-end">
							{/* will replace this with Image element */}
							{/* {url} */}
							{url && isHuman && (
								<img
									src={url ?? ""}
									width={128}
									height={128}
									alt="attached_image"
									className="w-32 h-32"
								/>
							)}
						</div>
						{!isTool && (
							<Bubble variant={isHuman ? "human" : "ai"}>
								<Markdown content={content} isHuman={isHuman} />
							</Bubble>
						)}
					</div>
				</Message>

				{/* model evaluation metrics */}
				<ModelEvaluation
					isHuman={isHuman}
					response_metadata={msg.response_metadata as ResponseMeta}
					usageMetadata={msg.usage_metadata}
				/>
			</div>
		);
	},
	(prev, next) =>
		prev.msg === next.msg &&
		prev.status === next.status &&
		prev.writerMessage === next.writerMessage,
);
MessageRow.displayName = "MessageRow";

interface ConversationProps {
	messages: ExtendedMessage[] | null;
	status?: StreamMessageStatus;
	isLoading?: boolean;
	writerMessage: CustomWriterMessage | null;
}

const ConversationComponent = ({
	messages,
	status,
	isLoading,
	writerMessage,
}: ConversationProps) => {
	const last = messages?.[messages.length - 1];
	const tailSignature = last
		? `${last.id}:${extractTextContent(last.content).length}`
		: "";
	const { endRef, sync } = useStickToBottom(tailSignature);

	const wasLoadingRef = useRef(false);
	useEffect(() => {
		if (wasLoadingRef.current && !isLoading) sync(true);
		wasLoadingRef.current = !!isLoading;
	}, [isLoading, sync]);

	if (!messages) return null;
	return (
		<div className="flex flex-col p-10 w-full gap-2 text-sm ">
			{messages.map((msg, index) => (
				<MessageRow
					key={msg.id ?? `row-${index}`}
					msg={msg}
					status={status}
					writerMessage={msg.customId ? writerMessage : null}
				/>
			))}
			<div ref={endRef} aria-hidden />
		</div>
	);
};

export const Conversation = memo(ConversationComponent, (prev, next) => {
	if (
		prev.status !== next.status ||
		prev.isLoading !== next.isLoading ||
		prev.writerMessage !== next.writerMessage
	) {
		return false;
	}
	const a = prev.messages;
	const b = next.messages;
	if (a === b) return true;
	if (!a || !b || a.length !== b.length) return false;
	return a.every((msg, i) => msg === b[i]);
});
Conversation.displayName = "Conversation";
