import { useMemo, useRef } from "react";
import { Message as LCMessage } from "@langchain/core/messages";
import { ExtendedMessage } from "@/features/chat/types/chat.types";

type CacheEntry = {
	src: LCMessage;
	sig: string | null;
	customId: string | undefined;
	out: ExtendedMessage;
};

/**
 * Signature of everything a row actually renders. Lets us detect that a
 * message is untouched even when the stream hands us a brand new object.
 */
function signatureOf(msg: ExtendedMessage, customId: string | undefined) {
	try {
		return JSON.stringify([
			customId ?? null,
			msg.type,
			msg.content,
			msg.name ?? null,
			msg.additional_kwargs ?? null,
			msg.response_metadata ?? null,
			msg.usage_metadata ?? null,
			msg.tool_calls ?? null,
			msg.tool_call_id ?? null,
		]);
	} catch {
		return null;
	}
}

/**
 * Merges loaded history with the live stream messages while keeping every
 * element referentially stable.
 *
 * The stream produces a new array (and a new object for the message that is
 * currently streaming) on every chunk. Without this, `memo` on the message
 * rows can never bail out, so the entire conversation re-renders - and
 * re-parses all of its markdown - for every single token.
 */
export function useStableMessages(
	history: LCMessage[],
	streamMessages: LCMessage[],
	activeCustomId?: string,
): ExtendedMessage[] {
	const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

	return useMemo(() => {
		const previous = cacheRef.current;
		const cache = new Map<string, CacheEntry>();

		// History first, then whatever the stream added that we have not loaded yet.
		const sources: { raw: LCMessage; key: string }[] = [];
		const seen = new Set<string>();
		let position = 0;
		for (const list of [history, streamMessages]) {
			for (const raw of list) {
				const key = raw.id ?? `anonymous:${position}`;
				position += 1;
				if (seen.has(key)) continue;
				seen.add(key);
				sources.push({ raw, key });
			}
		}

		const lastIndex = sources.length - 1;
		const result: ExtendedMessage[] = [];

		for (let i = 0; i < sources.length; i++) {
			const { raw, key } = sources[i];
			const msg = raw as ExtendedMessage;

			// Tag the trailing AI message of the active turn so WriterMessage and
			// Accordion can tell which bubble is currently streaming.
			const customId =
				i === lastIndex && msg.type === "ai" ? activeCustomId : undefined;

			const cached = previous.get(key);

			// Fast path: same source object and same customId -> nothing changed.
			if (cached && cached.src === raw && cached.customId === customId) {
				cache.set(key, cached);
				result.push(cached.out);
				continue;
			}

			const sig = signatureOf(msg, customId);

			// Slow path: new object, identical payload -> reuse the previous element.
			if (cached && sig !== null && cached.sig === sig) {
				const entry: CacheEntry = { src: raw, sig, customId, out: cached.out };
				cache.set(key, entry);
				result.push(entry.out);
				continue;
			}

			const out: ExtendedMessage =
				customId && customId !== msg.customId ? { ...msg, customId } : msg;

			cache.set(key, { src: raw, sig, customId, out });
			result.push(out);
		}

		cacheRef.current = cache;
		return result;
	}, [history, streamMessages, activeCustomId]);
}
